import json
import re

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core import mail
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils.encoding import smart_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.test import APITestCase, APITransactionTestCase
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import Profile, User
from accounts.serializers import ProfileSerializer, UserRegisterSerializer, UserSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

from accounts.tests.jwt_utils import generate_jwt_token, generate_jwt_authentication

LOGIN_URL = reverse('login')
TOKEN_VALIDATION_URL = reverse('accounts:validate-token')
REGISTER_URL = reverse('accounts:register')


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
        assert response.status_code == status.HTTP_201_CREATED
        assert Profile.objects.first().email == 'test@gmail.com'

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
        profile = Profile.objects.last()
        assert response.status_code == status.HTTP_201_CREATED
        assert profile.email == 'test@gmail.com'
        assert profile.surname == 'Smith'
        assert profile.name == 'John'
        assert profile.phone == '999888777'


class LoginTestCase(APITestCase):
    def setUp(self) -> None:
        self.user_data = {'email': 'test@gmail.com', 'password': 'testing321', }
        self.user = User.objects.create_user(**self.user_data)
        self.jwt_obj = JWTAuthentication()

    def test_user_login_token_generated(self):
        response = self.client.post(LOGIN_URL, self.user_data)

        assert response.status_code == status.HTTP_200_OK

        # Test if both tokens are included in response
        assert 'refresh' in response.data
        assert 'access' in response.data

        # Test if token user_id is the same as user id
        validated_token = self.jwt_obj.get_validated_token(response.data['access'])
        jwt_user = self.jwt_obj.get_user(validated_token)
        assert jwt_user.id == self.user.id

    def test_user_login_no_email(self):
        data = {'email': None, 'password': 'testing321'}
        response = self.client.post(LOGIN_URL, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_user_login_no_password(self):
        data = {'email': 'nopassword@gmail.com', 'password': None}
        response = self.client.post(LOGIN_URL, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data.get('detail', None) == 'Email and password required'

    def test_login_with_wrong_email(self):
        data = {'email': 'wrongemail@gmail.com', 'password': 'testing321'}
        response = self.client.post(LOGIN_URL, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data.get('detail', None) == 'Email or password incorrect'

    def test_login_with_wrong_password(self):
        data = {'email': 'test@gmail.com', 'password': '123testing'}
        response = self.client.post(LOGIN_URL, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data.get('detail', None) == 'Email or password incorrect'

    def test_user_authentication_view(self):
        _, access = generate_jwt_token(self.user)
        generate_jwt_authentication(self.client, access)
        response = self.client.get(TOKEN_VALIDATION_URL)

        assert response.status_code == status.HTTP_200_OK
        assert response.data.get('authenticated', False)

    def test_user_authentication_view_no_token(self):
        response = self.client.get(TOKEN_VALIDATION_URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class PasswordResetViewsTest(APITestCase):
    request_password_reset_url = reverse('accounts:password-reset-request-email')

    def setUp(self) -> None:
        self.user = User.objects.create_user(
            email='test@gmail.com',
            password='testing321'
        )

    def generate_reset_password_token_for_user(self, user):
        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)

        return {'uidb64': uidb64, 'token': token}

    def test_password_reset_correct_credentials(self):
        response_request_reset = self.client.post(self.request_password_reset_url, {'email': 'test@gmail.com'})
        assert response_request_reset.status_code == status.HTTP_200_OK
        assert len(mail.outbox) == 1

        url_regex = r"password-reset-confirm\/([A-Za-z0-9]+)\/([A-Za-z0-9-]+)"
        match = re.search(url_regex, mail.outbox[0].body)

        assert match.groups(), "Could not find the uidb64 and token in the email"
        uidb64 = match.group(1)
        token = match.group(2)

        password_reset_url = reverse('accounts:password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
        response_reset_confirm = self.client.get(password_reset_url)

        assert response_reset_confirm.data.get('success', False)
        assert response_reset_confirm.status_code == status.HTTP_200_OK
        assert response_reset_confirm.data.get('uidb64', None)
        assert response_reset_confirm.data.get('token', None)

        response_uidb64 = response_reset_confirm.data.get('uidb64', None)
        response_token = response_reset_confirm.data.get('token', None)

        assert response_uidb64 and response_uidb64 == uidb64
        assert response_token and response_token == token

        password_reset_complete_url = reverse('accounts:password-reset-complete')

        password_reset_data = {
            'password': 'newpassword321',
            'password_repeat': 'newpassword321',
            'uidb64': response_uidb64,
            'token': response_token,
        }

        response_reset_complete = self.client.patch(password_reset_complete_url, password_reset_data)
        assert response_reset_complete.status_code == status.HTTP_200_OK

    def test_password_reset_token_wrong_token_data(self):
        wrong_user = User.objects.create_user(email='wronguser@gmail.com', password='wronguser321')
        valid_data = self.generate_reset_password_token_for_user(self.user)
        wrong_data = self.generate_reset_password_token_for_user(wrong_user)

        data = {'uidb64': valid_data.get('uidb64'), 'token': wrong_data.get('token')}
        password_reset_url = reverse('accounts:password-reset-confirm', kwargs=data)
        response = self.client.get(password_reset_url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data.get('error', None)

    def test_password_reset_request_user_with_email_that_does_not_exist(self):
        response_request_reset = self.client.post(self.request_password_reset_url, {'email': 'doesnotexist@gmail.com'})
        assert response_request_reset.status_code == status.HTTP_200_OK
        assert len(mail.outbox) == 0


class ProfileViewSetTestCase(APITestCase):
    list_url = reverse('accounts:profile-list')

    def setUp(self) -> None:
        self.user = User.objects.create_user(
            email='test@gmail.com',
            password='testing321'
        )
        self.user.profile.name = 'John'
        self.user.profile.surname = 'Smith'
        self.user.profile.phone = '987654321'
        self.user.profile.save()
        self.profile = self.user.profile

        self.refresh, self.access = generate_jwt_token(self.user)
        generate_jwt_authentication(self.client, self.access)

    def test_profile_email_changed_on_create_user(self):
        assert self.user.profile.email == 'test@gmail.com'

    def test_profile_data_other_than_email_empty_after_create_user(self):
        user = User.objects.create_user(email='test2@gmail.com', password='testing321')
        assert user.profile.name is None
        assert user.profile.surname is None
        assert user.profile.phone is None

    def test_profile_detail_view(self):
        response = self.client.get(reverse(
            'accounts:profile-detail',
            kwargs={'pk': self.user.profile.id})
        )
        valid_data = {
            'id': self.user.profile.id, 'user': self.user.id, 'name': 'John', 'surname': 'Smith',
            'email': 'test@gmail.com', 'phone': '987654321', 'family': None
        }
        assert response.status_code == status.HTTP_200_OK
        assert response.data == valid_data

    def test_profile_view_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_url)
        assert response.status_code, status.HTTP_401_UNAUTHORIZED

    def test_profile_update_by_owner(self):
        data = {'name': 'Test', 'surname': 'User',
                'email': 'changed@gmail.com', 'phone': '111333111', }
        response = self.client.put(
            reverse('accounts:profile-detail', kwargs={'pk': self.user.profile.id}), data=data
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Test'
        assert response.data['email'] == 'changed@gmail.com'

    def test_profile_update_not_by_owner(self):
        user = User.objects.create_user(email='hack@gmail.com', password='testing321')
        _, access = generate_jwt_token(user)

        data = {'name': 'Hack', 'surname': 'Hacked', 'email': user.email}
        generate_jwt_authentication(self.client, access)
        response = self.client.put(
            reverse('accounts:profile-detail', kwargs={'pk': self.user.profile.id}), data=data
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


class ChangePasswordViewTest(APITestCase):
    change_password_url = reverse('accounts:user-password-change')

    def setUp(self) -> None:
        self.user = User.objects.create_user(
            email='test@gmail.com',
            password='testing321'
        )
        _, access = generate_jwt_token(self.user)
        generate_jwt_authentication(self.client, access)

    def test_user_change_password_correct_old_password(self):
        data = {
            'old_password': 'testing321',
            'password': 'newpassword321',
            'password2': 'newpassword321',
        }
        response = self.client.patch(self.change_password_url, data)
        assert response.status_code == status.HTTP_200_OK

    def test_user_change_password_incorrect_old_password(self):
        data = {
            'old_password': 'wrongpassword',
            'password': 'newpassword321',
            'password2': 'newpassword321',
        }
        response = self.client.patch(self.change_password_url, data)
        self.validate_password_change_response(response)

    def test_user_change_password_new_password_empty_string(self):
        data = {
            'old_password': 'testing321',
            'password': '',
            'password2': 'newpassword321',
        }
        response = self.client.patch(self.change_password_url, data)
        self.validate_password_change_response(response)

    def test_user_change_password_new_password2_empty_string(self):
        data = {
            'old_password': 'testing321',
            'password': 'newpassword321',
            'password2': '',

        }
        response = self.client.patch(self.change_password_url, data)
        self.validate_password_change_response(response)

    def test_user_change_password_new_passwords_as_empty_strings(self):
        data = {
            'old_password': 'testing321',
            'password': '',
            'password2': '',

        }
        response = self.client.patch(self.change_password_url, data)
        self.validate_password_change_response(response)

    def test_user_change_password_new_password_is_none(self):
        data = {
            'old_password': 'testing321',
            'password': None,
            'password2': 'newpassword321',
        }
        response = self.client.patch(self.change_password_url, data)
        self.validate_password_change_response(response)

    def test_user_change_password_new_password2_is_none(self):
        data = {
            'old_password': 'testing321',
            'password': 'newpassword321',
            'password2': None,

        }
        response = self.client.patch(self.change_password_url, data)
        self.validate_password_change_response(response)

    def test_user_change_password_new_passwords_as_none(self):
        data = {
            'old_password': 'testing321',
            'password': None,
            'password2': None,

        }
        response = self.client.patch(self.change_password_url, data)
        self.validate_password_change_response(response)

    def validate_password_change_response(self, response):
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert self.user.check_password('testing321')
