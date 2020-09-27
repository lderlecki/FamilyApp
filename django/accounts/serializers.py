from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User, Profile
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email')


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'user', 'full_name', 'email', 'phone', 'family_name')


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'password2',)
        extra_kwargs = {'password': {'write_only': True}}

    def save(self, **kwargs):
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match.'})

        user = User.objects.create_user(email=self.validated_data['email'], password=password)
        # user.set_password(password)
        # user.save()
        return user


# Add custom data to the token
# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#
#     @classmethod
#     def get_token(cls, user):
#         token = super(CustomTokenObtainPairSerializer, cls).get_token(user)
#
#         # Add custom claims
#         token['test'] = 'testLALALAtest'
#
#         return token

