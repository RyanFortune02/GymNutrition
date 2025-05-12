from django.urls import path
# Import both views
from .views import OpenFoodFactsSearchView, UserRecentFoodView

urlpatterns = [
    path(
        "search/",
        OpenFoodFactsSearchView.as_view(),
        name="food_search", # /good practice to name urls
    ),
    # /add url for recent foods
    path(
        "recent/",
        UserRecentFoodView.as_view(),
        name="food_recent", # /name for the recent foods url
    ),
]
