import json
from datetime import datetime

from django.urls import reverse
from mixer.backend.django import mixer
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import Profile, User
from accounts.serializers import ProfileSerializer, UserRegisterSerializer, UserSerializer
from accounts.tests.jwt_utils import generate_jwt_token, generate_jwt_authentication
from rest_framework_simplejwt.authentication import JWTAuthentication

from family.models import Family
from task_list.models import TodoList, Task

LOGIN_URL = reverse('login')


class TestTaskListViews(APITestCase):
    todo_create_url = reverse('task_list:todolist-create')

    def setUp(self) -> None:
        self.user = User.objects.create_user(
            email='test@gmail.com',
            password='testing321'
        )
        profile = self.user.profile

        self.family = mixer.blend(Family, family_name='testfamilyname', family_head=profile)
        profile.family = self.family
        profile.save()

        self.authenticate_user(self.user)

    def authenticate_user(self, user):
        _, access = generate_jwt_token(user)
        generate_jwt_authentication(self.client, access)

    def test_todolist_create_without_tasks(self):
        data = {
            "name": "Test todolist create without tasks",
            "description": "Todo with tasks",
            "family": self.family.id,
            "due_date": None,
            "tasks": []
        }
        response = self.client.post(self.todo_create_url, data)
        todo_obj = TodoList.objects.last()
        assert response.status_code == status.HTTP_201_CREATED
        assert todo_obj.name == data.get('name')
        assert todo_obj.description == data.get('description')
        assert todo_obj.family == self.family

    def test_todolist_create_with_tasks(self):
        data = {
            "description": "Todo with tasks",
            "family": self.family.id,
            "name": "Test todo with tasks",
            "tasks": [
                {
                    "name": "Task1",
                    "profile": None,
                    "description": "Task1D"
                },
                {
                    "name": "Task2",
                    "profile": None,
                    "description": "Task2D"
                },
                {
                    "name": "Task3",
                    "profile": None,
                    "description": "Task3D"
                }
            ]
        }
        response = self.client.post(self.todo_create_url, data)
        assert response.status_code == status.HTTP_201_CREATED
        todo_obj = TodoList.objects.last()

        assert todo_obj.task_set.count() == 3

    def test_todolist_create_user_no_family(self):
        data = {
            "name": "Todolist User has no family",
            "description": "Todo",
            "family": self.family.id,
            "due_date": None,
            "tasks": []
        }
        user = mixer.blend(User)
        self.authenticate_user(user)
        response = self.client.post(self.todo_create_url, data)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_todolist_create_for_different_family_then_user_is_in(self):
        user = mixer.blend(User)
        test_family = mixer.blend(Family, family_head=user.profile)
        data = {
            "name": "Todolist User has no family",
            "description": "Todo",
            "family": test_family.id,
            "due_date": None,
            "tasks": []
        }
        response = self.client.post(self.todo_create_url, data)
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert TodoList.objects.count() == 0

    def test_todolist_create_when_user_family_none_and_family_is_none_in_request(self):
        user = mixer.blend(User)
        test_family = mixer.blend(Family, family_head=user.profile)
        data = {
            "name": "Todolist User has no family",
            "description": "Todo",
            "family": None,
            "due_date": None,
            "tasks": []
        }
        self.authenticate_user(user)
        response = self.client.post(self.todo_create_url, data)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert TodoList.objects.count() == 0

    def test_todolist_create_with_task_where_responsible_person_is_not_in_users_family(self):
        user = mixer.blend(User)
        data = {
            "description": "Todo with tasks",
            "family": self.family.id,
            "name": "Test todo with tasks",
            "tasks": [
                {
                    "name": "Task1",
                    "profile": user.profile.id,
                    "description": "Task1D"
                },
                {
                    "name": "Task2",
                    "profile": None,
                    "description": "Task2D"
                }
            ]
        }
        response = self.client.post(self.todo_create_url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert TodoList.objects.count() == 0


class TaskViewSetTest(APITestCase):
    task_create_url = reverse('task_list:tasks-list')

    def setUp(self) -> None:
        self.user = User.objects.create_user(
            email='testtask@gmail.com',
            password='testing321'
        )
        profile = self.user.profile
        family = mixer.blend(Family, family_name='testfamilyname', family_head=profile)
        profile.family = family
        profile.save()

        self.todolist = mixer.blend(TodoList, family=family)
        self.authenticate_user(self.user)

    def authenticate_user(self, user):
        _, access = generate_jwt_token(user)
        generate_jwt_authentication(self.client, access)

    def test_task_create_request(self):
        data = {
            "name": "Task correct",
            "profile": None,
            "description": "Task2D",
            "todolist": self.todolist.id

        }
        response = self.client.post(self.task_create_url, data)

        assert response.status_code == status.HTTP_201_CREATED
        assert Task.objects.count() == 1

    def test_task_create_responsible_person_has_no_family(self):
        user = mixer.blend(User)
        data = {
            "name": "Task responsible person has no family",
            "profile": user.profile.id,
            "description": "Task2D",
            "todolist": self.todolist.id

        }
        response = self.client.post(self.task_create_url, data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.get('todolist') == 'You are not authorized to perform this action.'
        assert Task.objects.count() == 0

    def test_task_create_responsible_person_is_not_in_todolist_family(self):
        user = mixer.blend(User)
        family = mixer.blend(Family, family_head=user.profile)
        user.profile.family = family
        user.profile.save()
        data = {
            "name": "Task responsible person is not a member of todolist family",
            "profile": user.profile.id,
            "description": "Task2D",
            "todolist": self.todolist.id

        }
        response = self.client.post(self.task_create_url, data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.get('todolist') == 'You are not authorized to perform this action.'
        assert Task.objects.count() == 0

    def test_task_create_no_todolist_specified(self):
        data = {
            "name": "Task no todolist provided",
            "profile": self.user.profile.id,
            "description": "Task2D",
            "todolist": None
        }
        response = self.client.post(self.task_create_url, data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.get('todolist') == 'Todolist object not specified.'
        assert Task.objects.count() == 0


class TaskViewSetGetAndUpdateTest(APITestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(
            email='test@gmail.com',
            password='testing321'
        )
        profile = self.user.profile
        family = mixer.blend(Family, family_name='testfamilyname', family_head=profile)
        profile.family = family
        profile.save()

        self.todolist = mixer.blend(TodoList, family=family)
        self.task_valid_data = {
            "name": "Test task update",
            "profile": self.user.profile,
            "description": "this should change",
            "done": False,
            "todolist": self.todolist
        }
        self.task = Task.objects.create(**self.task_valid_data)
        self.authenticate_user(self.user)

    def authenticate_user(self, user):
        _, access = generate_jwt_token(user)
        generate_jwt_authentication(self.client, access)

    def test_task_retrieve(self):
        url = self.get_detail_url(self.task.id)
        response = self.client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert self.task.name == response.data.get('name')
        assert self.task.description == response.data.get('description')
        assert self.task.done == response.data.get('done')

    def test_update_task_data(self):
        expected_data = {
            "name": "Updated Name",
            "profile": self.user.profile.id,
            "description": "Task updated",
            "done": True,
            "todolist": self.todolist.id
        }
        update_url = self.get_detail_url(self.task.id)
        response = self.client.patch(update_url, expected_data)

        print(response.data)

        assert response.status_code == status.HTTP_200_OK
        assert expected_data.get('name') == response.data.get('name')
        assert expected_data.get('description') == response.data.get('description')
        assert expected_data.get('done') == response.data.get('done')

    def get_detail_url(self, pk):
        return reverse('task_list:tasks-detail', kwargs={'pk': pk})

