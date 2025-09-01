from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Includes additional fields like age_group and is_superadmin.
    """
    AGE_CHOICES = [
        ('4-6', '4-6 years'),
        ('7-12', '7-12 years'),
        ('13+', '13+ years'),
    ]

    # Explicitly define first_name and last_name to make them more flexible
    # and to ensure they are present.
    first_name = models.CharField(max_length=150, blank=True, default="")
    last_name = models.CharField(max_length=150, blank=True, default="")

    # Add a name field to store the concatenated full name
    name = models.CharField(max_length=255, blank=True)

    age_group = models.CharField(max_length=10, choices=AGE_CHOICES, blank=True)
    is_superadmin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Add these to fix the reverse accessor conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_set",
        related_query_name="customuser",
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_set",
        related_query_name="customuser",
    )

    def __str__(self):
        return self.email
