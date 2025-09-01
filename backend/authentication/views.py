from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from .models import CustomUser

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    print("=== SIGNUP DEBUG ===")
    print("Request data:", request.data)

    serializer = UserRegistrationSerializer(data=request.data)

    if serializer.is_valid():
        print("Serializer is valid")
        # Check if user already exists
        if CustomUser.objects.filter(email=serializer.validated_data['email']).exists():
            print("User already exists")
            return Response({
                'message': 'User with this email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        print(f"User created: {user.username}, email: {user.email}, active: {user.is_active}")

        # Test password immediately after creation
        test_password = request.data.get('password')
        password_works = user.check_password(test_password)
        print(f"Password test after creation: {password_works}")

        return Response({
            'message': 'User created successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    else:
        print("Serializer errors:", serializer.errors)
        return Response({
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def signin_view(request):
    print("=== SIGNIN DEBUG ===")
    print("Request data:", request.data)

    serializer = UserLoginSerializer(data=request.data)

    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        print(f"Trying to authenticate email: {email}")

        try:
            user = CustomUser.objects.get(email=email)
            print(f"User found: {user.username}, active: {user.is_active}")

            if not user.is_active:
                print("User is not active")
                return Response({
                    'message': 'User account is deactivated'
                }, status=status.HTTP_401_UNAUTHORIZED)

            authenticated_user = authenticate(username=email, password=password)
            print(f"Authentication with email as username: {authenticated_user}")

            if not authenticated_user:
                authenticated_user = authenticate(username=user.username, password=password)
                print(f"Authentication with username: {authenticated_user}")

            if not authenticated_user:
                if user.check_password(password):
                    print("Password is correct, using user directly")
                    authenticated_user = user
                else:
                    print("Password check failed")

            if authenticated_user:
                refresh = RefreshToken.for_user(authenticated_user)

                return Response({
                    'message': 'Login successful',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': UserLoginSerializer(authenticated_user).data
                }, status=status.HTTP_200_OK)
            else:
                print("Authentication failed - invalid credentials")
                return Response({
                    'message': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        except CustomUser.DoesNotExist:
            print("User does not exist")
            return Response({
                'message': 'User does not exist'
            }, status=status.HTTP_404_NOT_FOUND)
    else:
        print("Serializer errors:", serializer.errors)
        return Response({
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_users_list(request):
    """List all users (admin only)"""
    try:
        users = CustomUser.objects.all()
        serialized_users = UserLoginSerializer(users, many=True)
        return Response({
            'message': 'Users retrieved successfully',
            'users': serialized_users.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'message': 'Error retrieving users',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def admin_delete_user(request, user_id):
    """Delete a user (admin only)"""
    try:
        user = CustomUser.objects.get(id=user_id)
        user.delete()
        return Response({
            'message': 'User deleted successfully'
        }, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'message': 'Error deleting user',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    """Get admin statistics"""
    try:
        total_users = CustomUser.objects.count()
        active_users = CustomUser.objects.filter(is_active=True).count()
        
        return Response({
            'message': 'Stats retrieved successfully',
            'stats': {
                'total_users': total_users,
                'active_users': active_users,
                'inactive_users': total_users - active_users
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'message': 'Error retrieving stats',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user