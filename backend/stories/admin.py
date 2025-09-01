from django.contrib import admin
from .models import Story, StoryAnalysis, AuthorshipDetection

@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'source', 'age_group', 'created_at']
    list_filter = ['source', 'age_group']
    search_fields = ['title', 'story']

@admin.register(StoryAnalysis)
class StoryAnalysisAdmin(admin.ModelAdmin):
    list_display = ['story', 'word_count', 'sentiment_label', 'created_at']

@admin.register(AuthorshipDetection)
class AuthorshipDetectionAdmin(admin.ModelAdmin):
    list_display = ['story', 'predicted_source', 'confidence_score', 'created_at']