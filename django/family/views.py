from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Family
from .serializers import FamilySerializer


class FamilyViewSet(viewsets.ModelViewSet):
    queryset = Family.objects.all()
    serializer_class = FamilySerializer


class FamilyCreateView(generics.CreateAPIView):
    queryset = Family.objects.all()
    serializer_class = FamilySerializer

    authentication_classes = [JWTAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def create(self, request, *args, **kwargs):
        user = request.user
        print(request.data)
        print('user id:', user.profile.id)
        family_head = request.data.get('family_head', None)
        if not family_head:
            return Response(
                {'error': 'Family head must be provided in order to create family.'}, status=status.HTTP_400_BAD_REQUEST
            )
        if family_head != user.profile.id:
            return Response(
                {'error': 'You can only create family for you, not other users.'}, status=status.HTTP_400_BAD_REQUEST
            )

        if user.profile.has_family:
            return Response({'error': 'User is already a family member.'}, status=status.HTTP_409_CONFLICT)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        family_instance = serializer.save()

        user.profile.family = family_instance
        user.profile.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
