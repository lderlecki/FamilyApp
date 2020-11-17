from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import viewsets, views, status, exceptions, generics
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, Profile
from .permissions import IsOwnerOrReadOnly
from .serializers import (
    UserSerializer,
    UserRegisterSerializer,
    ProfileSerializer,
    RequestPasswordResetEmailSerializer,
    SetNewPasswordSerializer,
    ChangePasswordSerializer,
)
from .utils import generate_password_reset_email, send_email


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class UserRegisterView(generics.GenericAPIView):
    serializer_class = UserRegisterSerializer

    def post(self, request, *args, **kwargs):
        user_data = request.data['userData']
        serializer = self.serializer_class(data=user_data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        profile_data = request.data.get('profileData', None)
        if profile_data:
            profile = user.profile
            profile.name = profile_data.get('name', None)
            profile.surname = profile_data.get('surname', None)
            profile.phone = profile_data.get('phoneNumber', None)
            profile.save()
        return Response('', status=status.HTTP_201_CREATED)



class ProfileViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication, ]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly, ]

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        email = request.data.get('email', None)
        password = request.data.get('password', None)

        if email is None or password is None:
            raise exceptions.AuthenticationFailed('Email and password required')

        user = User.objects.filter(email=email).first()
        if not user or not user.check_password(password):
            raise exceptions.AuthenticationFailed('Email or password incorrect')

        refresh = RefreshToken.for_user(user)

        refresh_token = str(refresh)
        access_token = str(refresh.access_token)

        data = {
            'refresh': refresh_token,
            'access': access_token,
            'uid': user.id,
        }
        return Response(data=data, status=status.HTTP_200_OK)


class TokenValidationView(views.APIView):
    authentication_classes = [JWTAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def get(self, request, *args, **kwargs):
        return Response({'authenticated': True}, status=status.HTTP_200_OK)


class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = RequestPasswordResetEmailSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            user = User.objects.get(email=email)
            email = generate_password_reset_email(request, user)
            send_email(email)
        return Response({
            'success': 'Email with link to reset the password was sent to the given email address, '
                       'if such a user exists'},
            status=status.HTTP_200_OK)


class PasswordTokenValidateAPI(generics.GenericAPIView):

    def get(self, request, uidb64, token):
        try:
            user_id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise DjangoUnicodeDecodeError
            return Response(
                {'success': True, 'message': 'Validation passed', 'uidb64': uidb64, 'token': token},
                status=status.HTTP_200_OK
            )

        except DjangoUnicodeDecodeError as e:
            return Response({'error': 'Token is not valid, please request password reset again.'},
                            status=status.HTTP_401_UNAUTHORIZED)


class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response({'success': True, 'message': 'Password reset success.'},
                        status=status.HTTP_200_OK)


class ChangePasswordView(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    authentication_classes = [JWTAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password changed successfully',
                'data': []
            }
            return Response(response)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
