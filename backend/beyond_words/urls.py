from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import get_user_model
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import os

def api_root(request):
    return JsonResponse({
        'message': 'Welcome to Beyond Words API',
        'version': '1.0',
        'endpoints': {
            'stories': {
                'list_all': '/api/stories/',
                'get_specific': '/api/stories/{id}/',
                'filter_by_age': '/api/stories/?age_group=4-6',
                'filter_by_source': '/api/stories/?source=AI',
                'search': '/api/stories/?search=keyword',
                'by_age_group': '/api/stories/by_age_group/?age_group=4-6',
                'sources': '/api/stories/sources/'
            },
            'analysis': '/api/analysis/',
            'auth': '/api/auth/',
            'hero_video': '/api/hero-video/',
            'admin': '/admin/'
        },
        'documentation': 'Visit /admin/ for admin interface'
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_hero_video(request):
    """Return the hero video URL"""
    video_path = os.path.join(settings.MEDIA_ROOT, 'hero-video.mp4')
    webm_path = os.path.join(settings.MEDIA_ROOT, 'hero-video.webm')
    
    videos = {}
    
    # Check for MP4 video
    if os.path.exists(video_path):
        videos['mp4'] = f'{settings.MEDIA_URL}hero-video.mp4'
    
    # Check for WebM video
    if os.path.exists(webm_path):
        videos['webm'] = f'{settings.MEDIA_URL}hero-video.webm'
    
    return Response({
        'videos': videos,
        'has_video': len(videos) > 0,
        'primary_video': videos.get('mp4', videos.get('webm', None)),
        'message': 'Hero video data retrieved successfully' if len(videos) > 0 else 'No hero video found'
    })

# TEMPORARY FUNCTION - REMOVE AFTER CREATING ADMIN
def create_temp_admin(request):
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        try:
            User.objects.create_superuser(
                username='admin',
                email='admin@beyondwords.com', 
                password='BeyondWords2024!'
            )
            return JsonResponse({
                'status': 'SUCCESS: Admin user created!',
                'username': 'admin',
                'password': 'BeyondWords2024!',
                'next_steps': [
                    '1. Go to /admin/ and login with these credentials',
                    '2. Change the password immediately',
                    '3. Remove the create-admin URL from urls.py',
                    '4. Add some Story objects to test your API'
                ]
            })
        except Exception as e:
            return JsonResponse({'error': f'Failed to create admin: {str(e)}'})
    return JsonResponse({
        'status': 'Admin user already exists',
        'message': 'Go to /admin/ to login'
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/stories/', include('stories.urls')),
    path('api/analysis/', include('analysis.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/hero-video/', get_hero_video, name='hero-video'),
    path('create-admin/', create_temp_admin, name='create_admin'),  # TEMPORARY - REMOVE AFTER USE
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
