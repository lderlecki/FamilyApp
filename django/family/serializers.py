from accounts.models import Profile
from accounts.serializers import ProfileSerializer
from .models import Family
from rest_framework import serializers


class FamilySerializer(serializers.ModelSerializer):
    family_members = ProfileSerializer(many=True, read_only=True)

    class Meta:
        model = Family
        fields = ('id', 'budget', 'family_name', 'group_id', 'family_members')
