from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, views, status, exceptions, generics, mixins
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import TodoList, Task
from .permissions import IsMemberOrReadOnly, IsFamilyMember
from .serializers import TaskSerializer, TodolistSerializer
from .utils import validate_task_create_request, validate_todo_create


class TaskViewSet(mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  viewsets.GenericViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    authentication_classes = [JWTAuthentication, ]
    permission_classes = [IsAuthenticated, IsMemberOrReadOnly, ]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = TaskSerializer(instance=instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        validate_task_create_request(request)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        validate_task_create_request(request)

        serializer = TaskSerializer(
            instance=instance,
            data=request.data,
            partial=kwargs.get('partial', False)
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


class TodolistView(generics.CreateAPIView):
    queryset = TodoList.objects.all()
    serializer_class = TodolistSerializer

    permission_classes = [IsAuthenticated, IsFamilyMember, ]

    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data

        validate_todo_create(user, data)

        serializer = TodolistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
