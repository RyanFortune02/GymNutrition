#!/usr/bin/env python3
"""
test script for delete user endpoint.

creates a test user, logs in, then deletes the account.

run with: python test_delete_user.py
make sure server is running: python manage.py runserver
"""

import requests
import json
import sys

class DeleteUserTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.access_token = None
        self.test_username = "test_delete_user"
        self.test_password = "testpass123"
        
    def register_test_user(self):
        """create a test user for deletion"""
        url = f"{self.base_url}/api/user/register/"
        data = {
            "username": self.test_username,
            "password": self.test_password,
            "email": "testdelete@example.com",
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
    
    def test_delete_user(self):
        """test the delete user endpoint"""
        url = f"{self.base_url}/api/user/delete/"
        
        print(f"testing delete user endpoint...")
        
        try:
            response = requests.delete(url, headers=self.get_auth_headers())
            
            if response.status_code == 200:
                data = response.json()
                print("user deletion successful")
                print(f"response: {data}")
                return True
            else:
                print(f"user deletion failed: {response.status_code}")
                print(response.text)
                return False
                
        except Exception as e:
            print(f"error testing delete endpoint: {e}")
            return False
    
    def verify_user_deleted(self):
        """verify user can no longer login"""
        print(f"verifying user is deleted...")
        
        url = f"{self.base_url}/api/token/"
        data = {
            "username": self.test_username,
            "password": self.test_password
        }
        
        try:
            response = requests.post(url, json=data)
            if response.status_code == 401:
                print("verification successful - user cannot login anymore")
                return True
            else:
                print(f"unexpected response - user might still exist: {response.status_code}")
                return False
        except Exception as e:
            print(f"error verifying deletion: {e}")
            return False
    
    def run_full_test(self):
        """run complete delete user test"""
        print("starting delete user test...\n")
        
        #create and login
        if not self.register_test_user():
            return False
        
        if not self.authenticate():
            return False
        
        #test deletion
        if not self.test_delete_user():
            return False
        
        #verify deletion worked
        if not self.verify_user_deleted():
            return False
        
        print(f"\ndelete user test completed successfully")
        return True

def main():
    """run the test"""
    tester = DeleteUserTester()
    
    if tester.run_full_test():
        print(f"\nall tests passed")
        sys.exit(0)
    else:
        print(f"\nsome tests failed")
        sys.exit(1)

if __name__ == "__main__":
    main() 