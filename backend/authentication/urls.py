from django.urls import path
from . import views
from . import admin  # Import admin module

urlpatterns = [
    # Authentication endpoints (from views.py)
    path('signup/', views.signup_view, name='signup'),
    path('signin/', views.signin_view, name='signin'),
    path('logout/', views.logout_view, name='logout'),

    # Admin endpoints (from admin.py)
    path('admin/users/', admin.admin_users_list, name='admin_users_list'),
    path('admin/users/<int:user_id>/', admin.admin_user_detail, name='admin_user_detail'),
    path('admin/users/<int:user_id>/update/', admin.admin_update_user, name='admin_update_user'),
    path('admin/users/<int:user_id>/delete/', admin.admin_delete_user, name='admin_delete_user'),
    path('admin/stats/', admin.admin_stats, name='admin_stats'),
    path('admin/debug/users/', admin.debug_users_table, name='debug_users_table'),
    # User Profile endpoint - FIXED
    path('user/profile/', views.UserProfileView.as_view(), name='user-profile'),
]