from django.contrib import admin

# Register your models here.
from task_list.models import Task, TodoList

admin.site.register(TodoList)
admin.site.register(Task)
