from django.contrib import admin
from rest_framework import routers
from django.urls import path, include

from .views import (
    UserViewSet,
    UserRegisterView,
    ProfileViewSet,
    ProfileView,
    TokenValidationView,
)


router = routers.DefaultRouter()
router.register('users', UserViewSet, basename='user_list')
# router.register('register', UserRegisterViewSet, basename='user_register')
router.register('profiles', ProfileViewSet, basename='profile_list')

urlpatterns = [
    path(r'', include(router.urls)),
    path(r'register/', UserRegisterView.as_view()),
    path(r'get_user_data/', ProfileView.as_view()),
    path(r'validate/access/', TokenValidationView.as_view()),
]
