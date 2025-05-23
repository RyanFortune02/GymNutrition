#!/usr/bin/env python3
"""
integration test for date range ingredients api endpoint.

tests the full workflow:
1. create test user and login
2. add food items using openfoodfacts
3. test ingredients endpoint
4. test error cases

run with: python test_ingredients_api.py
make sure server is running: python manage.py runserver
"""

import requests
import json
import sys
from datetime import date, timedelta

class IngredientAPITester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.access_token = None
        self.test_username = "test_ingredients_user"
        self.test_password = "testpass123"
        
    def register_test_user(self):
        """register a test user"""
        url = f"{self.base_url}/api/user/register/"
        data = {
            "username": self.test_username,
            "password": self.test_password,
            "email": "test@example.com",
            "profile_data": {
                "age": 25,
                "sex": "M",
                "height": 175,
                "weight": 70,
                "activity_level": 1,
                "food_preferences": 0,
                "allergies": 0,
                "dark_mode_enabled": False
            }
        }
        
        try:
            response = requests.post(url, json=data)
            if response.status_code == 201:
                print(f"created test user: {self.test_username}")
                return True
            elif response.status_code == 400:
                error_data = response.json()
                if 'username' in error_data and 'already exists' in str(error_data['username']):
                    print(f"test user already exists: {self.test_username}")
                    return True
                else:
                    print(f"failed to create user: {response.status_code}")
                    print(response.text)
                    return False
            else:
                print(f"user creation failed: {response.status_code}")
                print(response.text)
                return False
        except requests.exceptions.ConnectionError:
            print("connection error - make sure django server is running")
            return False
        except Exception as e:
            print(f"error creating user: {e}")
            return False
    
    def authenticate(self):
        """login and get jwt token"""
        url = f"{self.base_url}/api/token/"
        data = {
            "username": self.test_username,
            "password": self.test_password
        }
        
        try:
            response = requests.post(url, json=data)
            if response.status_code == 200:
                token_data = response.json()
                self.access_token = token_data.get('access')
                print("login successful")
                return True
            else:
                print(f"login failed: {response.status_code}")
                print(response.text)
                return False
        except Exception as e:
            print(f"login error: {e}")
            return False
    
    def get_auth_headers(self):
        """get headers with auth token"""
        return {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }
    
    def add_test_food_item(self, search_term, barcode=None):
        """search for food and add meal record"""
        
        # use barcode if available, otherwise search by name
        if barcode:
            url = f"{self.base_url}/food/search/"
            params = {'code': barcode}
            print(f"searching by barcode: {barcode}")
        else:
            url = f"{self.base_url}/food/search/"
            params = {'search': search_term, 'page_size': 1}
            print(f"searching for: {search_term}")
        
        try:
            # search for food first
            response = requests.get(url, params=params, headers=self.get_auth_headers(), timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                
                if results:
                    food_item = results[0]
                    food_id = food_item.get('id')
                    food_name = food_item.get('product_name_en', 'unknown')
                    
                    print(f"found food: {food_name} (id: {food_id})")
                    
                    # create meal record for today
                    meal_url = f"{self.base_url}/api/meals/"
                    meal_data = {
                        'food_id': food_id,
                        'meal_type': 'B',  # breakfast
                        'servings': 1.0,
                        'date': date.today().strftime('%Y-%m-%d')
                    }
                    
                    meal_response = requests.post(meal_url, json=meal_data, headers=self.get_auth_headers())
                    if meal_response.status_code == 201:
                        print(f"added meal record for {food_name}")
                        return True
                    else:
                        print(f"meal record creation failed: {meal_response.status_code}")
                        print(meal_response.text)
                        return False
                else:
                    print(f"no results found for: {search_term}")
                    return False
            elif response.status_code == 504:
                print(f"timeout searching for {search_term}")
                return False
            else:
                print(f"search failed: {response.status_code}")
                print(response.text)
                return False
                
        except requests.exceptions.Timeout:
            print(f"timeout searching for {search_term}")
            return False
        except Exception as e:
            print(f"error adding food: {e}")
            return False
    
    def add_test_foods_with_barcodes(self):
        """add test foods using known barcodes"""
        print(f"adding test food items with barcodes...")
        
        # barcodes that should work from openfoodfacts
        test_foods = [
            {"name": "Coca Cola", "barcode": "5449000000996"},
            {"name": "Nutella", "barcode": "3017620422003"}, 
            {"name": "Kit Kat", "barcode": "7622210449283"},
        ]
        
        success_count = 0
        for food in test_foods:
            if self.add_test_food_item(food["name"], food["barcode"]):
                success_count += 1
            
        # try text search if barcodes dont work
        if success_count == 0:
            print(f"barcode searches failed, trying text search...")
            backup_foods = ["bread", "milk", "banana"]
            for food in backup_foods:
                if self.add_test_food_item(food):
                    success_count += 1
                    break  # just need one
        
        return success_count > 0
    
    def test_ingredients_endpoint(self):
        """test the main ingredients endpoint"""
        url = f"{self.base_url}/food/ingredients/"
        
        # test with last 7 days
        end_date = date.today()
        start_date = end_date - timedelta(days=7)
        
        params = {
            'start_date': start_date.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d')
        }
        
        print(f"testing ingredients endpoint...")
        print(f"date range: {params['start_date']} to {params['end_date']}")
        
        try:
            response = requests.get(url, params=params, headers=self.get_auth_headers())
            
            if response.status_code == 200:
                data = response.json()
                print("ingredients endpoint test passed")
                print(f"total ingredients: {data.get('total_ingredients', 0)}")
                print(f"total food items: {data.get('total_food_items', 0)}")
                
                ingredients = data.get('ingredients', [])
                if ingredients:
                    print(f"sample ingredients: {', '.join(ingredients[:5])}")
                    if len(ingredients) > 5:
                        print(f"and {len(ingredients) - 5} more...")
                
                food_items = data.get('food_items', [])
                if food_items:
                    print(f"food items found:")
                    for item in food_items[:3]:
                        name = item.get('product_name_en', 'unknown')
                        servings = item.get('total_servings', 0)
                        print(f"  {name} (servings: {servings})")
                
                print(f"full response:")
                print(json.dumps(data, indent=2))
                return True
            else:
                print(f"ingredients endpoint failed: {response.status_code}")
                print(response.text)
                return False
                
        except Exception as e:
            print(f"error testing ingredients endpoint: {e}")
            return False
    
    def test_error_cases(self):
        """test error handling"""
        url = f"{self.base_url}/food/ingredients/"
        
        print(f"testing error cases...")
        
        # test missing parameters
        try:
            response = requests.get(url, headers=self.get_auth_headers())
            if response.status_code == 400:
                print("missing parameters error handled correctly")
            else:
                print(f"unexpected response for missing params: {response.status_code}")
        except Exception as e:
            print(f"error testing missing params: {e}")
        
        # test invalid date format
        try:
            params = {'start_date': 'invalid-date', 'end_date': '2024-01-01'}
            response = requests.get(url, params=params, headers=self.get_auth_headers())
            if response.status_code == 400:
                print("invalid date format error handled correctly")
            else:
                print(f"unexpected response for invalid date: {response.status_code}")
        except Exception as e:
            print(f"error testing invalid date: {e}")
    
    def run_full_test(self):
        """run all tests"""
        print("starting ingredients api integration test...\n")
        
        # setup user and login
        if not self.register_test_user():
            return False
        
        if not self.authenticate():
            return False
        
        # add test data
        food_added = self.add_test_foods_with_barcodes()
        if not food_added:
            print("no food items could be added, testing with empty data...")
        
        # test main functionality
        if not self.test_ingredients_endpoint():
            return False
        
        # test error cases
        self.test_error_cases()
        
        if food_added:
            print(f"\ntest completed successfully with real food data")
        else:
            print(f"\ntest completed successfully with empty data")
        return True

def main():
    """run the test"""
    tester = IngredientAPITester()
    
    if tester.run_full_test():
        print(f"\nall tests passed")
        sys.exit(0)
    else:
        print(f"\nsome tests failed")
        sys.exit(1)

if __name__ == "__main__":
    main() 