from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.StoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('load-stories/', views.load_stories_data, name='load_stories_data'),
]
