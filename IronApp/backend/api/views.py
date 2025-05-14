from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.response import Response
from datetime import datetime, timedelta
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from .models import Note, UserProfile, MealRecord
from .serializers import (
    UserSerializer,
    NoteSerializer,
    UserProfileSerializer,
    MealRecordSerializer,
)


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context


class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(UserProfile, user=self.request.user)


class MealRecordListCreate(generics.ListCreateAPIView):
    serializer_class = MealRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = MealRecord.objects.filter(user=self.request.user)
        
        # filter the queryset by date
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(date=date)
        
        return queryset.order_by("-date")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Allows for the retrieval, updating, and deletion of a specific meal record
class MealRecordDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MealRecordSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return MealRecord.objects.filter(user=self.request.user)


class NutritionSummaryView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.GET.get("days", 30))
        end_date = datetime.now().date()

        # Generate all dates in range
        date_range = [end_date - timedelta(days=d) for d in range(days)]
        summaries = []

        for date in date_range:
            totals = MealRecord.get_daily_totals(request.user, date)
            totals["date"] = date.isoformat()
            summaries.append(totals)

        return Response(summaries)
