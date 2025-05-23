# GymNutrition Project README

Just some notes about the project.

## Loging Stuff

The backend uses python's loging thing. It writes messages about what the app is doing, like errors and stuff.

It's good to check the logs if something goes wrong.

**Helpful Resorce:**

- **Django Docs - Logging:** [https://docs.djangoproject.com/en/stable/topics/logging/](https://docs.djangoproject.com/en/stable/topics/logging/)
  - This page from the django website explains how the logging works. It has examples too.

## testing

### setup

- `cd IronApp/backend`
- `python manage.py runserver`
- open new terminal for tests

### integration tests

**ingredients api test**

- file: `test_ingredients_api.py`
- tests: `/food/ingredients/` endpoint
- what it does: gets ingredients from food items in date range
- run: `python test_ingredients_api.py`
