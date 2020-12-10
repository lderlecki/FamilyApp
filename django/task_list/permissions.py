from rest_framework import permissions

from family.models import Family


class IsMemberOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.todolist.family_id == request.user.profile.family_id


class IsFamilyMember(permissions.BasePermission):
    def has_permission(self, request, view):
        family_id = request.data.get('family')
        family_id = int(family_id) if family_id else None

        # request.user.profile.family_id throws Attribute Error if user.profile has no family FK
        user_family_id = request.user.profile.family_id
        if user_family_id is None:
            return False
        return family_id == user_family_id
