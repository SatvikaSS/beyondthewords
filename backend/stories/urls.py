from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.StoryViewSet, basename='story')

urlpatterns = [
    # Router URLs (will create /stories/ endpoints)
    path('', include(router.urls)),
]
