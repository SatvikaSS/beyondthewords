from django.urls import path
from . import views

urlpatterns = [
    path('', views.analysis_root, name='analysis_root'),  # Add this line
    path('detailed/<int:story_id>/', views.detailed_analysis, name='detailed_analysis'),
    path('authorship/<int:story_id>/', views.authorship_detection, name='authorship_detection'),
]