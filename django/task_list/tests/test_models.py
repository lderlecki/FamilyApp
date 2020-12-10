import pytest

from django.test import TestCase

from mixer.backend.django import mixer

from accounts.models import User
from family.models import Family
from task_list.models import TodoList, Task

pytest_mark = pytest.mark.django_db


class TestTaskAndTodoListModel(TestCase):
    def setUp(self) -> None:
        user = User.objects.create(email='TestTodos@gmail.com', password='testing321')
        family = mixer.blend(Family, family_name='testfamilyname', family_head=user.profile)
        self.todo = mixer.blend(TodoList, name='Test TodoList', family=family)

    def test_todo_created(self):
        assert isinstance(self.todo, TodoList)
        assert str(self.todo) == 'Family: testfamilyname, Name: Test TodoList'

    def test_task_create(self):
        task = mixer.blend(Task, name='TestTaskCreate', todolist=self.todo)

        assert isinstance(task, Task)
        assert str(task) == 'Family: testfamilyname, Name: Test TodoList, Task: TestTaskCreate'
