from django.urls import path

from . import views
from .views import ChangePasswordView

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/<int:pk>/", views.NoteDelete.as_view(), name="note-delete"),
    path("user/profile/", views.UserProfileView.as_view(), name="user-profile"),
    path(
        "meals/", views.MealRecordListCreate.as_view(), name="meal-list-create"
    ),
    path("meals/<int:pk>/", views.MealRecordDetail.as_view(), name="meal-detail"),
    path(
        "nutrition/summary/",
        views.NutritionSummaryView.as_view(),
        name="nutrition-summary",
    ),
    path(
        "meals/batch-create/",
        views.MealRecordBatchCreateView.as_view(),
        name="meal-batch-create",
    ),
    path(
        "auth/change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),
]
