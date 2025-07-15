# GymNutrition Project

A nutrition and fitness tracking application to help users monitor their dietary intake and maintain healthy eating habits. Built with Django REST framework backend and React frontend.

## What it does

The app lets users:

- Track daily food intake with detailed nutritional information
- Search for foods from a comprehensive database
- Generate grocery lists based on their meal history
- View nutritional data with charts and analytics
- Calculate BMR (Basal Metabolic Rate) for personalized goals
- Manage their food logs with a calendar interface

## Setup Instructions

### Prerequisites

- Node.js (version 16 or higher)
- Python 3.8+
- npm or yarn
- PostgreSQL database (for production) OR SQLite (for development)

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd IronApp/backend
   ```

2. Create and activate virtual environment:

   ```bash
   python -m venv env
   # On Windows:
   . env/Scripts/Activate.ps1
   # On Mac/Linux:
   source env/bin/activate
   ```

3. Install dependencies:

   ```bash
   python -m pip install python-dotenv
   pip install -r requirements.txt
   ```

4. **Configure your database** (choose one):

   **Option A: PostgreSQL (Recommended for Production)**

   - Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
   - Create database and user:
     ```sql
     psql -d postgres -U postgres
     CREATE ROLE my_user WITH LOGIN PASSWORD 'your_password';
     ALTER ROLE my_user CREATEDB;
     CREATE DATABASE gym_nutrition_db;
     ```
   - Update Django settings (`backend/settings.py`):
     ```python
     DATABASES = {
         'default': {
             'ENGINE': 'django.db.backends.postgresql',
             'NAME': 'gym_nutrition_db',
             'USER': 'my_user',
             'PASSWORD': 'your_password',
             'HOST': 'localhost',
             'PORT': '5432',
         }
     }
     ```

   **Option B: SQLite (Quick Setup for Development)**

   - Update Django settings (`backend/settings.py`):
     ```python
     DATABASES = {
         'default': {
             'ENGINE': 'django.db.backends.sqlite3',
             'NAME': BASE_DIR / 'db.sqlite3',
         }
     }
     ```
   - **Create SQLite database**: The SQLite database file (`db.sqlite3`) will be automatically created when you run migrations in the next step. No additional setup required!

5. Run database migrations:

   ```bash
   python manage.py migrate
   ```

6. Start the Django server:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd IronApp/frontend
   ```

2. Install all dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Tech Stack

### Frontend

- **React** 19.0.0 - Main UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router DOM** - Navigation and routing
- **Recharts** - Charts and data visualization
- **React Calendar** - Calendar component for date selection
- **Framer Motion** - Animations
- **Axios** - HTTP requests to backend
- **Lucide React** - Icons

### Backend

- **Django** - Python web framework
- **Django REST Framework** - API development
- **JWT** - Authentication tokens
- **PostgreSQL** - Database (production)
- **Python Logging** - Error tracking and debugging

## Testing

### Unit Tests

I implemented unit tests for the core backend functionality using Django's testing framework. These tests are isolated and don't require the server to be running - they create a temporary test database automatically.

**How I Implemented Unit Tests:**

- Used Django's `TestCase` class for model testing and data validation
- Used `APITestCase` for testing API endpoints and authentication
- Created mock data within tests to avoid dependencies on real database
- Used `force_authenticate()` to simulate user login for protected endpoints

**Unit Test Coverage (5 tests total):**

1. **Nutrient Calculation Test** (`api/tests.py`)

   - Tests if meal records calculate nutrition values correctly with different serving sizes
   - Verifies multiplication logic works (2 servings = double nutrients)

2. **Daily Totals Test** (`api/tests.py`)

   - Tests if daily nutrition totals add up properly across multiple meals
   - Verifies the `get_daily_totals()` method sums correctly

3. **User Registration Test** (`api/tests.py`)

   - Tests successful user account creation through the API
   - Verifies both User and UserProfile objects get created

4. **Authentication Test** (`api/tests.py`)

   - Tests that unauthorized users can't access protected meal endpoints
   - Verifies security is working properly

5. **Food Product Creation Test** (`fooddata/tests.py`)
   - Tests creating FoodProduct objects with nutrition data
   - Verifies all fields save correctly to database

**How to Run Unit Tests:**

```bash
cd IronApp/backend

# run all unit tests
python manage.py test -v 2

# run specific app tests
python manage.py test api.tests -v 2
python manage.py test fooddata.tests -v 2
```

The `-v 2` flag shows detailed output so you can see each test running. This is a built in Django feature. Where as the `-v 3` flag shows even more detailed output, including the time each test took to run. Furthermore, the `-v 3` flag will show the output of the print statements in the test cases. and the `-v 1` flag shows the minimum output.
A resource I used to learn about the different flags is [here](https://docs.djangoproject.com/en/5.2/ref/django-admin/#cmdoption-verbosity).

### Integration Tests

Integration tests require the backend server to be running since they make real HTTP requests to test the full system end-to-end.

1. Make sure the backend server is running:

   ```bash
   cd IronApp/backend
   python manage.py runserver
   ```

2. Open a new terminal for tests

**Available Integration Tests:**

**Ingredients API Test**

- File: `test_ingredients_api.py`
- Tests: `/food/ingredients/` endpoint
- What it does: Gets ingredients from food items in date range
- Run: `python test_ingredients_api.py`

**Delete User Test**

- File: `test_delete_user.py`
- Tests: `/api/user/delete/` endpoint
- What it does: Creates user, deletes account, verifies deletion
- Run: `python test_delete_user.py`

### Frontend Testing

```bash
cd IronApp/frontend
npm run lint  # Check code quality
```

## Logging Stuff

The backend uses Python's logging system. It writes messages about what the app is doing, like errors and important events.

It's good to check the logs if something goes wrong.

**Helpful Resource:**

- **Django Docs - Logging:** [https://docs.djangoproject.com/en/stable/topics/logging/](https://docs.djangoproject.com/en/stable/topics/logging/)
  - This page from the Django website explains how logging works. It has examples too.

## Key Features

### Food Logging

- Search from extensive food database
- Log meals by date and time
- View nutritional breakdowns and daily summaries

### Grocery List Generator

- Select date ranges from your food log history
- Automatically generate shopping lists
- Export lists as text files

### Progress Tracking

- Visual charts showing nutritional intake
- BMR calculator for personalized goals
- Calendar interface for easy navigation

## Resources Used

### Authentication & Backend

- [Authentication/Users](https://www.youtube.com/watch?v=c-QsfbznSXI)
- [JWT token and Role based permissions](https://www.youtube.com/watch?v=5JG5PyU1CXI)

### Testing

- [Writing and running tests - Django 5.2](https://docs.djangoproject.com/en/5.2/topics/testing/overview/) - Used for implementing unit tests with TestCase and APITestCase
- [Django Testing Tutorial](https://docs.djangoproject.com/en/5.2/intro/tutorial05/) - Helped with API endpoint testing and authentication patterns

### Frontend Development

- [Download a String as a TXT File in React](https://medium.com/@iyiolaosuagwu/download-a-string-as-a-txt-file-in-react-7d55efb22536) - Used for grocery list export functionality
- [Create Export React Frontend](https://spin.atomicobject.com/create-export-react-frontend/) - Best practices for client-side data export
- [Login page tutorial](https://www.youtube.com/watch?v=Rp9LgClUIYc&list=LL&index=14&t=2048s)
- [Tailwind CSS Navigation](https://tailwindcss.com/plus/ui-blocks/preview) - Stacked and dark navigation
- [Tailwind CSS Progress Bar](https://flowbite.com/docs/components/progress/)
- [Basal Metabolic Rate Calculator](https://www.omnicalculator.com/health/bmr-harris-benedict-equation#what-is-a-bmr-calculator)

## How to Use

1. **Start both servers**: Run backend (`python manage.py runserver`) and frontend (`npm run dev`)
2. **Create account**: Sign up on the frontend
3. **Log food**: Use the search to find foods and add them to your daily log
4. **View progress**: Check charts and analytics to track your nutrition
5. **Generate grocery lists**: Select date ranges to create shopping lists from your food history

## Common Issues

- Make sure both backend and frontend are running on different ports
- Check that all dependencies are installed properly
- Look at the server logs if you encounter API errors
- Ensure PostgreSQL is running if using production database

This project helps people track their nutrition and make healthier food choices through an easy-to-use web interface.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
