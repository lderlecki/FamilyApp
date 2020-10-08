from rest_framework import viewsets, views, status, exceptions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, Profile
from .permissions import IsOwnerOrReadOnly
from .serializers import UserSerializer, UserRegisterSerializer, ProfileSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class UserRegisterView(views.APIView):

    def post(self, request, *args, **kwargs):
        user_data = request.data['userData']
        serializer = UserRegisterSerializer(data=user_data)
        if serializer.is_valid():
            user = serializer.save()
            profile_data = request.data.get('profileData', None)
            if profile_data:
                profile = user.profile
                profile.name = profile_data.get('name', None)
                profile.surname = profile_data.get('surname', None)
                profile.phone = profile_data.get('phoneNumber', None)
                profile.save()
            return Response('', status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors)


class ProfileViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication, ]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly, ]

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    # def retrieve(self, request, pk=None, *args, **kwargs):
    #     user = request.user
    #     if str(user.id) == pk:
    #         serializer = ProfileSerializer(Profile.objects.get(user=user))
    #         return Response(serializer.data)
    #     return Response('Not authorized to get this user data', status=status.HTTP_401_UNAUTHORIZED)


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

        # response.set_cookie(key='access', value=access_token, httponly=False)
        # response.set_cookie(key='refresh', value=refresh_token, httponly=False)

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
