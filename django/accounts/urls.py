from django.contrib import admin
from rest_framework import routers
from django.urls import path, include

from .views import (
    UserViewSet,
    UserRegisterView,
    ProfileViewSet,
    TokenValidationView,
)


router = routers.DefaultRouter()
router.register('users', UserViewSet, basename='user')
router.register('profiles', ProfileViewSet, basename='profile')

urlpatterns = [
    path(r'', include(router.urls)),
    path(r'register/', UserRegisterView.as_view(), name='register'),
    path(r'validate/access/', TokenValidationView.as_view(), name='validate-token'),
]
