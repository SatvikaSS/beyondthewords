import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.http import HttpResponse

schema_view = get_schema_view(
    openapi.Info(
        title="Beyond Words API",
        default_version='v1',
        description="API for Beyond Words",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@beyondwords.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# A simple view for the root URL
def api_root(request):
    return HttpResponse("Welcome to Beyond Words API")

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def get_hero_video(request):
    """Return the hero video URL from static files"""
    video_path = os.path.join(settings.STATIC_ROOT, 'hero_video.mp4')
    webm_path = os.path.join(settings.STATIC_ROOT, 'hero_video.webm')
    
    videos = {}
    
    # Check for MP4 video
    if os.path.exists(video_path):
        videos['mp4'] = f'{settings.STATIC_URL}hero_video.mp4'
    
    # Check for WebM video
    if os.path.exists(webm_path):
        videos['webm'] = f'{settings.STATIC_URL}hero_video.webm'
    
    return Response({
        'videos': videos,
        'has_video': len(videos) > 0,
        'primary_video': videos.get('mp4', videos.get('webm', None)),
        'message': 'Hero video data retrieved successfully' if len(videos) > 0 else 'No hero video found'
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/stories/', include('stories.urls')),
    path('api/analysis/', include('analysis.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/hero-video/', get_hero_video, name='hero-video'),
]

# This is a critical line for serving static files in production on Render
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
