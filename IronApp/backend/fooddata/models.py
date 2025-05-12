from django.db import models
from django.contrib.auth.models import User

class FoodProduct(models.Model):
    """
    Represents a food product from OpenFoodFacts database.

    This model stores comprehensive product information including nutritional
    data, ingredients, allergens, and product categories. All data is sourced
    from the OpenFoodFacts database and maintains the original data structure
    for consistency, except for the `id` and `keywords` fields, which are `_id`
    and `_keywords` when received from the OpenFoodFacts API.

    Attributes:
        id: Unique product identifier from OpenFoodFacts database
        keywords: List of product keywords and tags
        allergens_tags: List of allergen warnings with 'en:' prefix
        brands: Product brand name
        categories_imported: Comma-separated list of product categories
        complete: Indicates if product data is complete in OpenFoodFacts
        image_url: URL of product image
        ingredients_text_en: English text listing product ingredients
        product_name_en: Product name in English
        nutriments: Nutritional information including:
            energy-kcal_serving: Energy content in kcal per serving
            fat_serving: Fat content per serving in grams
            carbohydrates_serving: Carbohydrate content per serving in grams
            proteins_serving: Protein content per serving in grams
            salt_serving: Salt content per serving in grams
            sugars_serving: Sugar content per serving in grams
            fiber_serving: Fiber content per serving in grams
            saturated-fat_serving: Saturated fat content per serving in grams
            sodium_serving: Sodium content per serving in grams
            cholesterol_serving: Cholesterol content per serving in grams
            trans-fat_serving: Trans fat content per serving in grams
            calcium_serving: Calcium content per serving in grams
            iron_serving: Iron content per serving in grams
            vitamin-a_serving: Vitamin A content per serving in grams
            vitamin-c_serving: Vitamin C content per serving in grams
        serving_size: Standard serving size
    """

    id = models.CharField(max_length=255, primary_key=True)
    keywords = models.JSONField(default=list)
    allergens_tags = models.JSONField(default=list)
    brands = models.CharField(max_length=255)
    categories_imported = models.CharField(max_length=255)
    complete = models.BooleanField(default=False)
    image_url = models.CharField(max_length=255)
    ingredients_text_en = models.TextField()
    product_name_en = models.CharField(max_length=255)
    nutriments = models.JSONField(default=dict)
    serving_size = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product_name_en or 'Unknown Product'} ({self.id})"

class UserRecentFood(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food_product = models.ForeignKey(FoodProduct, on_delete=models.CASCADE)
    accessed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'food_product')
        ordering = ['-accessed_at']

    def __str__(self):
        return f"{self.user.username} accessed {self.food_product.id} at {self.accessed_at}"
