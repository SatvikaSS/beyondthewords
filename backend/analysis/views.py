from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from stories.models import Story

def analysis_root(request):
    """Root endpoint for analysis API"""
    return JsonResponse({
        'message': 'Analysis API',
        'endpoints': {
            'detailed_analysis': '/api/analysis/detailed/{story_id}/',
            'authorship_detection': '/api/analysis/authorship/{story_id}/',
        }
    })

def detailed_analysis(request, story_id):
    story = get_object_or_404(Story, id=story_id)
    # Your analysis logic here
    return JsonResponse({
        'story_id': story_id,
        'title': story.title,
        'analysis': 'Detailed analysis results for this story...'
    })

def authorship_detection(request, story_id):
    story = get_object_or_404(Story, id=story_id)
    # Your authorship detection logic here
    return JsonResponse({
        'story_id': story_id,
        'title': story.title,
        'authorship': 'Human',  # or 'AI'
        'confidence': 0.85
    })