from rest_framework import serializers
from .models import Story

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = '__all__'
        
    def to_representation(self, instance):
        """Custom representation to format the output"""
        data = super().to_representation(instance)
        # Format the story preview for list views
        if len(data.get('story', '')) > 200:
            data['story_preview'] = data['story'][:200] + '...'
        else:
            data['story_preview'] = data['story']
        return data