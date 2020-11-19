from datetime import datetime

from django.utils import timezone
from rest_framework import serializers

from accounts.models import Profile
from .models import TodoList, Task


class TaskResponsiblePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    responsiblePerson = TaskResponsiblePersonSerializer(source='profile', read_only=True)

    class Meta:
        model = Task
        fields = '__all__'

    def to_representation(self, instance):
        data = super(TaskSerializer, self).to_representation(instance)
        _ = data.pop('profile')
        return data


class TodolistSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(source='task_set', many=True)

    class Meta:
        model = TodoList
        fields = '__all__'

    def to_representation(self, instance):
        data = super(TodolistSerializer, self).to_representation(instance)
        data['dueDate'] = data.pop('due_date')
        return data

    def validate(self, attrs):
        due_date = attrs.get('due_date', None)
        if due_date is None or due_date == '':
            attrs['due_date'] = timezone.now()
        return attrs

    def create(self, validated_data):
        tasks = validated_data.pop('task_set')
        todo_instance = TodoList.objects.create(**validated_data)
        for new_task in tasks:
            task_instance = Task.objects.create(**new_task, todolist=todo_instance)
        return todo_instance

