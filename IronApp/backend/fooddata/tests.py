from django.test import TestCase

from .models import FoodProduct


class FoodProductModelTest(TestCase):
    """food product model tests"""

    def test_create_food_product(self):
        """test creating food product"""
        food = FoodProduct.objects.create(
            id='test12345',
            product_name_en='Test Product',
            brands='Test Brand',
            categories_imported='snacks,cookies',
            complete=True,
            image_url='http://example.com/image.jpg',
            ingredients_text_en='flour, sugar, butter',
            serving_size='30g',
            nutriments={
                'energy-kcal_serving': 150,
                'proteins_serving': 3,
                'fat_serving': 8,
                'carbohydrates_serving': 18
            },
            keywords=['snack', 'cookie'],
            allergens_tags=['en:gluten', 'en:milk']
        )
        
        self.assertEqual(food.id, 'test12345')
        self.assertEqual(food.product_name_en, 'Test Product')
        self.assertEqual(food.brands, 'Test Brand')
        self.assertTrue(food.complete)
        self.assertEqual(food.serving_size, '30g')
