from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import date
from decimal import Decimal

from .models import UserProfile, MealRecord
from fooddata.models import FoodProduct


class MealRecordModelTest(TestCase):
    """meal record model tests"""

    def setUp(self):
        # create test user
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        
        # create test food with nutrition data
        self.food = FoodProduct.objects.create(
            id='test123',
            product_name_en='Test Food',
            brands='Test Brand',
            categories_imported='test category',
            complete=True,
            image_url='http://test.com/image.jpg',
            ingredients_text_en='test ingredients',
            serving_size='100g',
            nutriments={
                'energy-kcal_serving': 100,
                'proteins_serving': 5,
                'fat_serving': 2,
                'carbohydrates_serving': 15
            }
        )

    def test_get_nutrients_calculation(self):
        """test nutrient calculation with multiple servings"""
        meal = MealRecord.objects.create(
            user=self.user,
            meal_type=MealRecord.MealType.LUNCH,
            food=self.food,
            servings=Decimal('2.0')
        )
        
        nutrients = meal.get_nutrients()
        
        # should be doubled for 2 servings
        self.assertEqual(nutrients['calories'], 200.0)  # 100 * 2
        self.assertEqual(nutrients['protein'], 10.0)    # 5 * 2
        self.assertEqual(nutrients['fat'], 4.0)         # 2 * 2
        self.assertEqual(nutrients['carbs'], 30.0)      # 15 * 2

    def test_get_daily_totals(self):
        """test daily totals calculation"""
        test_date = date.today()
        
        # add breakfast
        MealRecord.objects.create(
            user=self.user,
            date=test_date,
            meal_type=MealRecord.MealType.BREAKFAST,
            food=self.food,
            servings=Decimal('1.0')
        )
        
        # add lunch
        MealRecord.objects.create(
            user=self.user,
            date=test_date,
            meal_type=MealRecord.MealType.LUNCH,
            food=self.food,
            servings=Decimal('1.0')
        )
        
        totals = MealRecord.get_daily_totals(self.user, test_date)
        
        # totals should add up
        self.assertEqual(totals['calories'], 200.0)  # 100 + 100
        self.assertEqual(totals['protein'], 10.0)    # 5 + 5
        self.assertEqual(totals['fat'], 4.0)         # 2 + 2
        self.assertEqual(totals['carbs'], 30.0)      # 15 + 15


class UserViewTest(APITestCase):
    """user registration tests"""

    def setUp(self):
        self.client = APIClient()

    def test_create_user_success(self):
        """test user creation works"""
        url = '/api/user/register/'
        data = {
            'username': 'newuser',
            'password': 'newpass123',
            'email': 'new@example.com',
            'profile_data': {
                'age': 25,
                'sex': 'M',
                'height': 175,
                'weight': 70,
                'activity_level': 1,
                'food_preferences': 0,
                'allergies': 0
            }
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())
        self.assertTrue(UserProfile.objects.filter(user__username='newuser').exists())


class MealRecordViewTest(APITestCase):
    """meal record api tests"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client = APIClient()
        
        # setup test food
        self.food = FoodProduct.objects.create(
            id='test123',
            product_name_en='Test Food',
            brands='Test Brand',
            categories_imported='test',
            complete=True,
            image_url='http://test.com/image.jpg',
            ingredients_text_en='ingredients',
            serving_size='100g',
            nutriments={'energy-kcal_serving': 100}
        )

    def test_meal_record_unauthorized_access(self):
        """test unauthorized access blocked"""
        url = '/api/meals/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
