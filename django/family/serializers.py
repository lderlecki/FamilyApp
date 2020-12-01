from accounts.models import Profile
from .models import Family, Address
from rest_framework import serializers


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class FamilyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'name', 'surname', 'email', 'phone')


class FamilySerializer(serializers.ModelSerializer):
    family_members = FamilyMemberSerializer(many=True, read_only=True)
    # family_head = serializers.StringRelatedField()
    address = AddressSerializer()

    class Meta:
        model = Family
        fields = ('id', 'budget', 'family_name', 'group_id', 'family_members', 'family_head', 'address',)

    def to_representation(self, instance):
        data = super(FamilySerializer, self).to_representation(instance)
        data['familyName'] = data.pop('family_name')
        data['groupId'] = data.pop('group_id')
        data['familyMembers'] = data.pop('family_members')
        data['familyHead'] = data.pop('family_head')
        return data

    def create(self, validated_data):
        address = validated_data.pop('address', None)
        if not address:
            raise serializers.ValidationError({'address': 'Please provide address data.'})
        address_instance = Address.objects.create(**address)
        family_instance = Family.objects.create(**validated_data, address=address_instance)
        return family_instance
