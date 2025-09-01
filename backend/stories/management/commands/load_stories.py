from django.core.management.base import BaseCommand
from stories.models import Story
import json
import os

class Command(BaseCommand):
    help = 'Load stories from ai_stories.json file'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help='Path to ai_stories.json file')

    def handle(self, *args, **options):
        file_path = options['file_path']
        
        if not os.path.exists(file_path):
            self.stdout.write(
                self.style.ERROR(f'File {file_path} does not exist')
            )
            return
        
        with open(file_path, 'r', encoding='utf-8') as file:
            stories_data = json.load(file)
        
        created_count = 0
        for story_data in stories_data:
            story, created = Story.objects.get_or_create(
                title=story_data['title'],
                defaults={
                    'story': story_data['story'],
                    'source': story_data['source'],
                    'age_group': story_data['age_group'],
                    'safety_violations': story_data.get('safety_violations', {}),
                    'stereotypes_biases': story_data.get('stereotypes_biases', {})
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'Created story: {story.title}')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully loaded {created_count} stories from {file_path}'
            )
        )