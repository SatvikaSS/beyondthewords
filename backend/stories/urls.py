from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'stories', views.StoryViewSet, basename='story')

urlpatterns = [
    # Custom data loading endpoint
    path('load-data/', views.load_stories_data, name='load_stories_data'),
    
    # Router URLs (will create /stories/ endpoints)
    path('', include(router.urls)),
]
