from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from .models import CustomUser
from .serializers import UserLoginSerializer

# Django Admin Interface Registration
@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    # The fields to show in the list view of the admin
    list_display = (
        'username',
        'email',
        'first_name',
        'last_name',
        'age_group',
        'is_active',
        'is_staff',
        'is_superuser'
    )
    list_filter = ['is_active', 'is_staff', 'is_superuser', 'age_group']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['email']

    # The fields to show in the user's detail page
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'age_group')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # The fields for adding a new user from the admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'age_group', 'password', 'password2'),
        }),
    )
    
    # Custom method to get read-only fields
    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ('username',)
        return self.readonly_fields

# API Views (This is fine, but it is better to have these in views.py)
def is_super_admin(user):
    return user.is_authenticated and user.is_superadmin

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_list(request):
    if not is_super_admin(request.user):
        return Response({
            'message': 'Permission denied. Super admin access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    users = CustomUser.objects.all().order_by('-created_at')
    serializer = UserLoginSerializer(users, many=True)
    
    return Response({
        'message': 'Users retrieved successfully',
        'count': users.count(),
        'users': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_user_detail(request, user_id):
    """Get detailed info about a specific user"""
    if not is_super_admin(request.user):
        return Response({
            'message': 'Permission denied. Super admin access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = CustomUser.objects.get(id=user_id)
        serializer = UserLoginSerializer(user)
        return Response({
            'message': 'User retrieved successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_update_user(request, user_id):
    """Update user status (activate/deactivate)"""
    if not is_super_admin(request.user):
        return Response({
            'message': 'Permission denied. Super admin access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = CustomUser.objects.get(id=user_id)
        
        # Only allow updating certain fields
        allowed_fields = ['is_active']
        update_data = {k: v for k, v in request.data.items() if k in allowed_fields}
        
        if not update_data:
            return Response({
                'message': 'No valid fields to update'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        for field, value in update_data.items():
            setattr(user, field, value)
        
        user.save()
        serializer = UserLoginSerializer(user)
        
        return Response({
            'message': 'User updated successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    
    except CustomUser.DoesNotExist:
        return Response({
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_user(request, user_id):
    if not is_super_admin(request.user):
        return Response({
            'message': 'Permission denied. Super admin access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = CustomUser.objects.get(id=user_id)
        
        if user.is_superadmin:
            return Response({
                'message': 'Cannot delete super admin users.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if user.id == request.user.id:
            return Response({
                'message': 'Cannot delete your own account.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Store user info before deletion
        deleted_user_info = {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
        
        user.delete()
        return Response({
            'message': f'User {deleted_user_info["username"]} deleted successfully',
            'deleted_user': deleted_user_info
        }, status=status.HTTP_200_OK)
    
    except CustomUser.DoesNotExist:
        return Response({
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    if not is_super_admin(request.user):
        return Response({
            'message': 'Permission denied. Super admin access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    total_users = CustomUser.objects.count()
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    new_users_today = CustomUser.objects.filter(created_at__date=today).count()
    new_users_week = CustomUser.objects.filter(created_at__date__gte=week_ago).count()
    new_users_month = CustomUser.objects.filter(created_at__date__gte=month_ago).count()
    
    active_users = CustomUser.objects.filter(is_active=True).count()
    inactive_users = CustomUser.objects.filter(is_active=False).count()
    super_admins = CustomUser.objects.filter(is_superadmin=True).count()
    
    stats = {
        'totalUsers': total_users,
        'activeUsers': active_users,
        'inactiveUsers': inactive_users,
        'superAdmins': super_admins,
        'newUsersToday': new_users_today,
        'newUsersThisWeek': new_users_week,
        'newUsersThisMonth': new_users_month,
        'lastUpdated': timezone.now().isoformat()
    }
    
    return Response({
        'message': 'Stats retrieved successfully',
        'stats': stats
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debug_users_table(request):
    """Debug endpoint to see raw user data"""
    if not is_super_admin(request.user):
        return Response({
            'message': 'Permission denied. Super admin access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    users_data = []
    for user in CustomUser.objects.all():
        users_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_active': user.is_active,
            'is_superadmin': user.is_superadmin,
            'password_hash': user.password[:50] + "..." if user.password else None,
            'created_at': user.created_at,
            'last_login': user.last_login
        })
    
    return Response({
        'message': 'Debug data retrieved',
        'total_count': len(users_data),
        'users': users_data
    }, status=status.HTTP_200_OK)