from django.urls import path

from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/<int:pk>/", views.NoteDelete.as_view(), name="note-delete"),
    path("user/profile/", views.UserProfileView.as_view(), name="user-profile"),
    path(
        "meals/", views.MealRecordListCreate.as_view(), name="meal-list-create"
    ),
    path(
        "nutrition/summary/",
        views.NutritionSummaryView.as_view(),
        name="nutrition-summary",
    ),
]
