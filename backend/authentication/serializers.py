from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for handling user registration.
    Includes first_name, last_name, email, password, and age_group.
    """
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = CustomUser
        # The fields the serializer will accept and use to create a new user.
        fields = ('first_name', 'last_name', 'email', 'age_group', 'password')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'age_group': {'required': True},
        }
    
    def create(self, validated_data):
        """
        Custom create method to handle password hashing and user creation.
        This version ensures the 'name' field is populated to satisfy the
        database constraint, as the model's create_user method may not handle it directly.
        """
        # Extract fields from validated data, defaulting to empty strings
        first_name = validated_data.get('first_name', '')
        last_name = validated_data.get('last_name', '')
        email = validated_data.get('email')
        password = validated_data.get('password')
        age_group = validated_data.get('age_group', '')

        try:
            # 1. Create the user with the core required fields first.
            # We use the email as the username to satisfy the UserManager's requirement.
            user = CustomUser.objects.create_user(
                username=email,
                email=email,
                password=password
            )

            # 2. Set the other fields directly on the user object.
            # This is a more reliable way to ensure all fields are populated before saving.
            user.first_name = first_name
            user.last_name = last_name
            user.age_group = age_group
            
            # Construct the full name from first and last names.
            # This directly satisfies the 'NOT NULL' constraint on the 'name' field.
            user.name = f"{first_name} {last_name}".strip()

            # 3. Save the user object to persist all the new fields to the database.
            user.save()
            
            return user
        except Exception as e:
            # Add some detailed logging to help debug if a new issue arises.
            print(f"Error during user creation: {e}")
            raise serializers.ValidationError(f"Could not create user: {e}")


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for handling user login requests.
    It only needs to validate email and password.
    """
    email = serializers.EmailField()
    password = serializers.CharField()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer to expose core user data after creation or login.
    It includes a dynamic display_name field.
    """
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        # The fields to include in the serialized representation.
        fields = ['id', 'username', 'email', 'is_active', 'is_superadmin',
                  'created_at', 'last_login', 'display_name', 'first_name', 'last_name','age_group']
        read_only_fields = ['id', 'created_at', 'last_login']
    
    def get_display_name(self, obj):
        """
        Custom method to get a user's name for display, defaulting to email.
        """
        return obj.first_name if obj.first_name else obj.email
