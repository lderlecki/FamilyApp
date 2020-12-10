from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import DjangoUnicodeDecodeError, force_str
from django.utils.http import urlsafe_base64_decode

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import User, Profile
from family.serializers import FamilySerializer

from .utils import password_valid


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email')


class ProfileSerializer(serializers.ModelSerializer):
    family = FamilySerializer(read_only=True)
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all())])

    class Meta:
        model = Profile
        fields = ('id', 'user', 'name', 'surname', 'email', 'phone', 'family')


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'password2',)
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password_valid(password, password2):
            return attrs

    def save(self, **kwargs):
        password = self.validated_data['password']
        user = User.objects.create_user(email=self.validated_data['email'], password=password)
        return user


class RequestPasswordResetEmailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(min_length=2, required=True)

    class Meta:
        model = User
        fields = ('email',)

    def validate(self, attrs):
        email = attrs.get('email', None)
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError('User with this email does not exist.')
        return super().validate(attrs)


class SetNewPasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True, required=True)
    password_repeat = serializers.CharField(style={'input_type': 'password'}, write_only=True, required=True)
    uidb64 = serializers.CharField(write_only=True, required=True)
    token = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('password', 'password_repeat', 'uidb64', 'token',)

    def validate(self, attrs):
        password = attrs.get('password')
        password_repeat = attrs.get('password_repeat')
        uidb64 = attrs.get('uidb64')
        token = attrs.get('token')

        if password_valid(password, password_repeat):
            try:
                user_id = force_str(urlsafe_base64_decode(uidb64))
                user = User.objects.get(id=user_id)
                if not PasswordResetTokenGenerator().check_token(user, token):
                    raise DjangoUnicodeDecodeError('Reset password link is invalid', 401)
            except DjangoUnicodeDecodeError as e:
                pass
            return attrs

    def save(self, **kwargs):
        user_id = force_str(urlsafe_base64_decode(self.validated_data['uidb64']))
        user = User.objects.get(id=user_id)
        user.set_password(self.validated_data['password'])
        user.save()

        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(style={'input_type': 'password'}, required=True, write_only=True)
    password = serializers.CharField(style={'input_type': 'password'}, required=True, write_only=True)
    password2 = serializers.CharField(style={'input_type': 'password'}, required=True, write_only=True)

    class Meta:
        model = User

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Your old password is incorrect. Please try again.')
        return value

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password_valid(password, password2):
            return attrs

    def save(self, **kwargs):
        password = self.validated_data['password']
        user = self.context['request'].user
        user.set_password(password)
        user.save()
        return user
