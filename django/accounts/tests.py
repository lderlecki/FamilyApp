import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Profile, User
from .serializers import ProfileSerializer, UserRegisterSerializer, UserSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

LOGIN_URL = reverse('login')
REGISTER_URL = reverse('register')


class RegistrationTestCase(APITestCase):

    def test_user_register_without_profile_data(self):
        data = {
            'userData': {
                'email': 'test@gmail.com',
                'password': 'testing321',
                'password2': 'testing321'
            },
        }
        response = self.client.post(REGISTER_URL, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Profile.objects.first().email, 'test@gmail.com')

    def test_user_register_with_profile_data(self):
        data = {
            'profileData': {
                'name': 'John',
                'surname': 'Smith',
                'phoneNumber': '999888777',

            },
            'userData': {
                'email': 'test@gmail.com',
                'password': 'testing321',
                'password2': 'testing321'},
        }
        response = self.client.post(REGISTER_URL, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Profile.objects.first().email, 'test@gmail.com')
        self.assertEqual(Profile.objects.first().surname, 'Smith')
        self.assertEqual(Profile.objects.first().name, 'John')
        self.assertEqual(Profile.objects.first().phone, '999888777')


class LoginTestCase(APITestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(email='test@gmail.com',
                                             password='testing321')
        self.jwt_obj = JWTAuthentication()

    def test_user_login_token_generated(self):
        data = {'email': 'test@gmail.com', 'password': 'testing321', }
        response = self.client.post(LOGIN_URL, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test if both tokens are included in response
        self.assertContains(response, 'refresh')
        self.assertContains(response, 'access')

        # Test if token user_id is same as user id
        validated_token = self.jwt_obj.get_validated_token(response.data['access'])
        jwt_user = self.jwt_obj.get_user(validated_token)
        self.assertEqual(jwt_user.id, self.user.id)

    # def test_token_validation_view(self):
    #     # Test if request requiring authentication passes
    #     data = {'Authorization': f"Bearer {response.data['access']}"}
    #     response = self.client.get('/validate/access/', data)
    #     self.assertTrue(response.data['authenticated'])


class ProfileViewSetTestCase(APITestCase):
    list_url = reverse('profile-list')

    def setUp(self) -> None:
        self.user = User.objects.create_user(email='test@gmail.com',
                                             password='testing321')
        self.user.profile.name = 'John'
        self.user.profile.surname = 'Smith'
        self.user.profile.phone = '987654321'
        self.user.profile.save()
        self.profile = self.user.profile

        token = RefreshToken.for_user(self.user)
        self.refresh = token
        self.access = token.access_token
        self.api_authentication(self.access)

    def api_authentication(self, token):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(token)}')

    def test_profile_email_changed_on_create_user(self):
        self.assertEqual(self.user.profile.email, 'test@gmail.com')

    def test_profile_data_other_than_email_empty_after_create_user(self):
        user = User.objects.create_user(email='test2@gmail.com', password='testing321')
        self.assertEqual(user.profile.name, None)
        self.assertEqual(user.profile.surname, None)
        self.assertEqual(user.profile.phone, None)

    def test_profile_detail_view(self):
        response = self.client.get(reverse('profile-detail',
                                           kwargs={'pk': self.user.profile.id}))
        valid_data = {'id': 1, 'user': 1, 'name': 'John', 'surname': 'Smith',
                      'email': 'test@gmail.com', 'phone': '987654321',
                      'family_name': None}
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, valid_data)

    def test_profile_view_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_update_by_owner(self):
        data = {'name': 'Test', 'surname': 'User',
                'email': 'changed@gmail.com', 'phone': '111333111', }
        response = self.client.put(
            reverse('profile-detail', kwargs={'pk': self.user.profile.id}), data=data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test')
        self.assertEqual(response.data['email'], 'changed@gmail.com')

    def test_profile_update_not_by_owner(self):
        user = User.objects.create_user(email='hack@gmail.com', password='testing321')
        token = RefreshToken.for_user(user)

        data = {'name': 'Hack', 'surname': 'Hacked', 'email': user.email}
        self.api_authentication(token.access_token)
        response = self.client.put(
            reverse('profile-detail', kwargs={'pk': self.user.profile.id}), data=data
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


