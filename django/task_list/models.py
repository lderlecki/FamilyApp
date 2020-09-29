from django.db import models


# Create your models here.
from accounts.models import Profile


class TodoList(models.Model):
    class Meta:
        db_table = 'todo_list'

    name = models.CharField(max_length=255)
    due_date = models.DateTimeField(auto_now=False)
    description = models.CharField(max_length=255)


class Task(models.Model):
    class Meta:
        db_table = 'task'
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    todolist = models.ForeignKey('TodoList', on_delete=models.SET_NULL, blank=True, null=True)
    profile = models.ForeignKey(Profile, on_delete=models.SET_NULL, blank=True, null=True)
