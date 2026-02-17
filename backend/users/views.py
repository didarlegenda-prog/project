"""
Views for users app.
"""
from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes  # ← ДОБАВЬ
from django.contrib.auth import authenticate
from users.models import User, Address, UserProfile
from users.serializers.user_serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    UserProfileSerializer,
    AddressSerializer,
    ChangePasswordSerializer,
    ChangeEmailSerializer
)
from core.permissions import IsOwnerOrReadOnly


class UserRegistrationView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    
    post: Register a new user account.
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer


# ← ДОБАВЬ ЭТО НОВЫЙ VIEW
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    API endpoint to get current authenticated user.
    
    get: Get current user's information.
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserProfileView(generics.RetrieveAPIView):
    """
    API endpoint to retrieve user profile.
    
    get: Get current user's profile information.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


class UserProfileUpdateView(generics.UpdateAPIView):
    """
    API endpoint to update user profile.
    
    put: Update user profile completely.
    patch: Partially update user profile.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """
    API endpoint for changing user password.
    
    post: Change user password.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            # Check old password
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {"old_password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set new password
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response(
                {"detail": "Password updated successfully."},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeEmailView(APIView):
    """
    API endpoint for changing user email.
    
    post: Change user email (requires password verification).
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangeEmailSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            # Verify password
            if not user.check_password(serializer.validated_data['password']):
                return Response(
                    {"password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update email
            user.email = serializer.validated_data['new_email']
            user.is_email_verified = False  # Require re-verification
            user.save()
            
            return Response(
                {"detail": "Email updated successfully. Please verify your new email."},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing user addresses.
    
    list: Get all addresses for current user.
    create: Create a new address.
    retrieve: Get address details.
    update: Update an address.
    partial_update: Partially update an address.
    destroy: Delete an address.
    """
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)