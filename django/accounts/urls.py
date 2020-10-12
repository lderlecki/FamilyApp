from django.contrib import admin
from rest_framework import routers
from django.urls import path, include

from .views import (
    UserViewSet,
    UserRegisterView,
    ProfileViewSet,
    TokenValidationView,
    PasswordTokenValidateAPI,
    RequestPasswordResetEmail,
    SetNewPasswordAPIView,
)


router = routers.DefaultRouter()
router.register('users', UserViewSet, basename='user')
router.register('profiles', ProfileViewSet, basename='profile')

urlpatterns = [
    path(r'', include(router.urls)),
    path(r'register/', UserRegisterView.as_view(), name='register'),
    path(r'validate/access/', TokenValidationView.as_view(), name='validate-token'),
    path(r'request-reset-email/', RequestPasswordResetEmail.as_view(), name='request-reset-email'),
    path(r'password-reset/<uidb64>/<token>/', PasswordTokenValidateAPI.as_view(), name='password-reset-confirm'),
    path(r'password-reset-complete/', SetNewPasswordAPIView.as_view(), name='password-reset-complete')
]
