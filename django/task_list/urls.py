from rest_framework import routers
from django.urls import path, include
from .views import TaskViewSet, TodolistView

router = routers.DefaultRouter()
router.register('tasks', TaskViewSet, basename='tasks')

urlpatterns = [
    path(r'', include(router.urls), name='tasks-view'),
    path(r'todo/create/', TodolistView.as_view(), name='todolist-create'),
]
