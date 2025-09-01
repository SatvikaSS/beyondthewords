from django.core.management.base import BaseCommand
from authentication.models import CustomUser  # Import your custom model

class Command(BaseCommand):
    def handle(self, *args, **options):
        user = CustomUser.objects.create_user(  # Use CustomUser instead of User
            username='admin',
            email='admin@example.com',
            password='your_password',
            name='Admin User',
            age_group='13+',
            is_superadmin=True,
            is_staff=True,
            is_superuser=True
        )