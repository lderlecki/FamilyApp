from rest_framework import viewsets, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Profile
from .serializers import UserSerializer, UserRegisterSerializer, ProfileSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class UserRegisterView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)


class ProfileViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

