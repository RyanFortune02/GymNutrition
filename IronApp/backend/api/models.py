from enum import Flag
from django.db import models
from django.contrib.auth.models import User
from datetime import date

from fooddata.models import FoodProduct


# Create your models here.
class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(
        auto_now_add=True
    )  # sets time when note is created
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notes"
    )  # links note to user under a collection of notes,

    # using User.notes.all() will return all notes by that user
    # on_delete=models.CASCADE means that if the user is deleted, all notes by
    # that user will also be deleted
    def __str__(self):
        return self.title


class UserProfile(models.Model):
    """
    Stores health-related profile information for users.

    Attributes:
        user: One-to-one relationship with Django User model
        age: Age in years
        sex: Sex classification (M/F)
        height: Height rounded to the nearest centimeter
        weight: Weight rounded to the nearest kilogram
        weight_history: JSON list of tuples containing (weight, date).
        activity_level: Physical activity level (0 = None, 4 = Very High)
        food_preferences: Combined dietary preference flags
        allergies: Combined food allergy flags
    """

    MAX_AGE = 200
    MAX_HEIGHT = 300
    MAX_WEIGHT = 500

    class Sex(models.TextChoices):
        """
        Sex classification options.
        """

        MALE = "M"
        FEMALE = "F"

    class ActivityLevel(models.IntegerChoices):
        """
        Physical activity intensity levels.

        Levels range from sedentary to highly active lifestyles.
        """

        NONE = 0
        LIGHT = 1
        MODERATE = 2
        HIGH = 3
        VERY_HIGH = 4

    class FoodPreferences(Flag):
        """
        Dietary preference flags.

        These flags can be combined using bitwise operations to represent
        multiple dietary preferences simultaneously. For example:
        `VEGETARIAN | VEGAN` represents someone who follows both diets.
        """

        NONE = 0
        VEGETARIAN = 2**0
        VEGAN = 2**1
        PESCATARIAN = 2**2
        KETO = 2**3
        PALEO = 2**4
        GLUTEN_FREE = 2**5
        DAIRY_FREE = 2**6
        LOW_CARB = 2**7

    class Allergies(Flag):
        """
        Food allergy flags.

        These flags represent common food allergies and can be combined using
        bitwise operations to indicate multiple allergies. For example:
        `PEANUTS | TREE_NUTS` represents nut allergies.
        """

        NONE = 0
        PEANUTS = 2**0
        TREE_NUTS = 2**1
        MILK = 2**2
        EGGS = 2**3
        WHEAT = 2**4
        SOY = 2**5
        FISH = 2**6
        SHELLFISH = 2**7

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.PositiveSmallIntegerField()
    sex = models.CharField(max_length=1, choices=Sex)
    height = models.PositiveSmallIntegerField()
    weight = models.PositiveSmallIntegerField()
    weight_history = models.JSONField(default=list)
    activity_level = models.PositiveSmallIntegerField(choices=ActivityLevel)
    food_preferences = models.PositiveSmallIntegerField(
        default=FoodPreferences.NONE.value
    )
    allergies = models.PositiveSmallIntegerField(default=Allergies.NONE.value)


class MealRecord(models.Model):
    class MealType(models.TextChoices):
        """
        Meal classification options.
        """

        BREAKFAST = "B"
        LUNCH = "L"
        DINNER = "D"
        SNACK = "S"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=date.today)
    meal_type = models.CharField(max_length=1, choices=MealType)
    food = models.ForeignKey(FoodProduct, on_delete=models.CASCADE)
    servings = models.DecimalField(max_digits=5, decimal_places=2, default=1)

    def get_nutrients(self):
        """
        Calculate nutrients for this meal record based on servings.
        """

        nutrients = self.food.nutriments
        serving_multiplier = float(self.servings)

        return {
            "calories": nutrients.get("energy-kcal_serving", 0)
            * serving_multiplier,
            "protein": nutrients.get("proteins_serving", 0)
            * serving_multiplier,
            "fat": nutrients.get("fat_serving", 0) * serving_multiplier,
            "carbs": nutrients.get("carbohydrates_serving", 0)
            * serving_multiplier,
        }

    @classmethod
    def get_daily_totals(cls, user, date):
        """
        Calculate nutrition totals for given user and date.
        """
        meals = cls.objects.filter(user=user, date=date)
        totals = {"calories": 0, "protein": 0, "fat": 0, "carbs": 0}

        for meal in meals:
            nutrients = meal.get_nutrients()
            for key in totals:
                totals[key] += nutrients[key]

        return totals
