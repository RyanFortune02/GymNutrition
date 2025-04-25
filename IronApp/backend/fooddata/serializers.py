from rest_framework import serializers
from .models import FoodProduct
from django.core.validators import MinValueValidator
from typing import Dict, List


class NutrimentsSerializer(serializers.Serializer):
    """
    Serializer for nutriments data structure.
    """

    energy_kcal_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], source="energy-kcal_serving", default=0.0
    )
    fat_serving = serializers.FloatField(validators=[MinValueValidator(0)], default=0.0)
    carbohydrates_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], default=0.0
    )
    proteins_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], default=0.0
    )
    salt_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], default=0.0
    )
    sugars_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], default=0.0
    )
    fiber_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], default=0.0
    )
    saturated_fat_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], source="saturated-fat_serving", default=0.0
    )
    sodium_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], default=0.0
    )
    cholesterol_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], default=0.0
    )
    trans_fat_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], source="trans-fat_serving", default=0.0
    )
    calcium_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], default=0.0
    )
    iron_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], default=0.0
    )
    vitamin_a_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], source="vitamin-a_serving", default=0.0
    )
    vitamin_c_serving = serializers.FloatField(
        validators=[MinValueValidator(0)], source="vitamin-c_serving", default=0.0
    )


class FoodProductSerializer(serializers.ModelSerializer):
    """
    Serializer for FoodProduct model.
    """

    nutriments = NutrimentsSerializer(required=True)

    class Meta:
        model = FoodProduct
        fields = [
            "id",
            "keywords",
            "allergens_tags",
            "brands",
            "categories_imported",
            "complete",
            "image_url",
            "ingredients_text_en",
            "product_name_en",
            "nutriments",
            "serving_size",
        ]
        read_only_fields = ["id"]

    def validate_keywords(self, value: List[str]) -> List[str]:
        """
        Validate keywords list.
        """

        if not isinstance(value, list):
            raise serializers.ValidationError("Keywords must be a list of strings")
        return value

    def validate_allergens_tags(self, value: List[str]) -> List[str]:
        """
        Validate allergens tags list.
        """

        if not isinstance(value, list):
            raise serializers.ValidationError(
                "Allergens tags must be a list of strings"
            )
        return value

    def validate_nutriments(self, value: Dict) -> Dict:
        """
        Validate nutriments dictionary structure.
        """

        if not isinstance(value, dict):
            raise serializers.ValidationError("Nutriments must be a dictionary")
        return value

    def to_representation(self, instance):
        """
        Convert model instance to dictionary representation.
        """

        ret = super().to_representation(instance)

        # Clean up nutriments data by removing zero values
        nutriments = ret.get("nutriments", {})
        if nutriments:
            ret["nutriments"] = {
                key: value
                for key, value in nutriments.items()
                if value is not None and value != 0
            }

        return ret

    def create(self, validated_data):
        """
        Create a new FoodProduct instance.
        """

        return FoodProduct.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update an existing FoodProduct instance.
        """

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
