from django.db import models
from django.contrib.auth.models import User
import json

class Story(models.Model):
    AGE_CHOICES = [
        ('4-6', '4-6 years'),
        ('7-12', '7-12 years'),
        ('13+', '13+ years'),
    ]
    
    SOURCE_CHOICES = [
        ('AI', 'AI Generated'),
        ('Human', 'Human Written'),
    ]

    title = models.CharField(max_length=200)
    story = models.TextField()
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES)
    age_group = models.CharField(max_length=10, choices=AGE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    safety_violations = models.JSONField(default=dict, blank=True)
    stereotypes_biases = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class StoryAnalysis(models.Model):
    story = models.OneToOneField(Story, on_delete=models.CASCADE, related_name='analysis')
    word_count = models.IntegerField()
    sentence_count = models.IntegerField()
    ttr = models.FloatField()
    flesch_kincaid_grade = models.FloatField()
    ari_score = models.FloatField()
    sentiment_label = models.CharField(max_length=20)
    sentiment_score = models.FloatField()
    pos_distribution = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Analysis for {self.story.title}"

class AuthorshipDetection(models.Model):
    story = models.OneToOneField(Story, on_delete=models.CASCADE, related_name='authorship')
    predicted_source = models.CharField(max_length=10, choices=Story.SOURCE_CHOICES)
    confidence_score = models.FloatField()
    features = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Authorship for {self.story.title}"