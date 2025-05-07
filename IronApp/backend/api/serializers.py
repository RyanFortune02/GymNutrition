from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Note, UserProfile, MealRecord


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "age",
            "sex",
            "height",
            "weight",
            "activity_level",
            "food_preferences",
            "allergies",
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

    class Meta:
        model = MealRecord
        fields = ["id", "date", "meal_type", "food", "servings", "nutrients"]

    def get_nutrients(self, obj):
        return obj.get_nutrients()
