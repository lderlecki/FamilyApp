from django.test import Client
from rest_framework_simplejwt.tokens import RefreshToken


def generate_jwt_token(user):
    token = RefreshToken.for_user(user)
    refresh = token
    access = token.access_token
    return refresh, access


def generate_jwt_authentication(obj: Client, token):
    assert isinstance(obj, Client), "Object must be an instance of Django test client"
    obj.credentials(HTTP_AUTHORIZATION=f'Bearer {str(token)}')
