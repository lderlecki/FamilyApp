from django.contrib import admin
from .models import User, Profile


class CustomUserAdmin(admin.ModelAdmin):
    model = User


admin.site.register(User)
admin.site.register(Profile)
