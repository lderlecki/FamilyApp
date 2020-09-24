from django.contrib import admin
from rest_framework import routers
from django.urls import path, include

from .views import FamilyViewSet


router = routers.DefaultRouter()
router.register('families', FamilyViewSet, basename='user_list_view')

urlpatterns = [
    path(r'', include(router.urls)),
]
