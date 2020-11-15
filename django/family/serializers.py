from accounts.models import Profile
from .models import Family
from rest_framework import serializers


class FamilyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'name', 'surname', 'email', 'phone')


class FamilySerializer(serializers.ModelSerializer):
    family_members = FamilyMemberSerializer(many=True, read_only=True)
    family_head = serializers.StringRelatedField()

    class Meta:
        model = Family
        fields = ('id', 'budget', 'family_name', 'group_id', 'family_members', 'family_head')
