from django.contrib.auth.models import User
from django.contrib.auth import password_validation
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Note, UserProfile, MealRecord
from fooddata.serializers import FoodProductSerializer


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "age",
            "sex",
            "height",
            "weight",
            "weight_history",
            "activity_level",
            "food_preferences",
            "allergies",
            "dark_mode_enabled",
        ]

    def validate_age(self, value):
        if value < 0 or value > UserProfile.MAX_AGE:
            raise serializers.ValidationError(
                f"Age must be between 0 and {UserProfile.MAX_AGE}"
            )
        return value

    def validate_sex(self, value):
        if value not in UserProfile.Sex.values:
            raise serializers.ValidationError(
                f"Sex must be one of {UserProfile.Sex.values}"
            )
        return value

    def validate_height(self, value):
        if value < 0 or value > UserProfile.MAX_HEIGHT:
            raise serializers.ValidationError(
                f"Height must be between 0 and {UserProfile.MAX_HEIGHT} cm"
            )
        return value

    def validate_weight(self, value):
        if value < 0 or value > UserProfile.MAX_WEIGHT:
            raise serializers.ValidationError(
                f"Weight must be between 0 and {UserProfile.MAX_WEIGHT} kg"
            )
        return value


class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    profile_data = UserProfileSerializer(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "profile",
            "profile_data",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def get_profile(self, obj):
        try:
            profile = UserProfile.objects.get(user=obj)
            return UserProfileSerializer(profile).data
        except UserProfile.DoesNotExist:
            return None

    def create(self, validated_data):
        profile_data = validated_data.pop("profile_data")
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        UserProfile.objects.create(user=user, **profile_data)

        return user


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise ValidationError("Old password is not correct")
        return value

    def validate_new_password(self, value):
        password_validation.validate_password(value, self.context['request'].user)
        return value

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise ValidationError({"new_password": "The two password fields didn't match."})
        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "author", "created_at"]
        extra_kwargs = {"author": {"read_only": True}}


class MealRecordSerializer(serializers.ModelSerializer):
    nutrients = serializers.SerializerMethodField()
    servings = serializers.DecimalField(
        max_digits=5, decimal_places=2, coerce_to_string=False
    )
    
    # Gives details about the food item when retrieving a meal record
    # uses FoodProductSerializer to display the food details (name, brand, etc.)
    food = FoodProductSerializer(read_only=True)
    
    # Allows for the food ID to be sent to the backend when creating a meal record
    food_id = serializers.CharField(write_only=True)

    class Meta:
        model = MealRecord
        fields = ["id", "date", "meal_type", "food", "food_id", "servings", "nutrients"]

    def get_nutrients(self, obj):
        return obj.get_nutrients()
