from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime, timedelta, date
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from .serializers import PasswordChangeSerializer

from .models import Note, UserProfile, MealRecord
from .serializers import (
    UserSerializer,
    NoteSerializer,
    UserProfileSerializer,
    MealRecordSerializer,
)
from fooddata.models import FoodProduct


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


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Password updated successfully"}, 
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteUserView(APIView):
    """
    delete user account and all associated data
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        try:
            user = request.user
            username = user.username
            
            #delete the user account (and all associated data)
            user.delete()
            
            return Response(
                {"message": f"User account '{username}' deleted successfully"}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            #handle any errors during deletion
            return Response(
                {"error": "Failed to delete user account"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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


class MealRecordBatchCreateView(APIView):
    """
    Create multiple meal records across a date range.
    This endpoint is used for future food tracking.
    
    POST data should include:
    - food_id: ID of the food product
    - meal_type: Meal type (B, L, D, S)
    - servings: Number of servings (default 1)
    - start_date: Start date of range (YYYY-MM-DD)
    - end_date: End date of range (YYYY-MM-DD)
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Validate required fields
        required_fields = ['food_id', 'meal_type', 'start_date', 'end_date']
        for field in required_fields:
            if field not in request.data:
                return Response(
                    {"error": f"Missing required field: {field}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        try:
            # Get food product
            food_id = request.data.get('food_id')
            food = FoodProduct.objects.get(id=food_id)
            
            # Parse dates
            start_date = datetime.strptime(request.data.get('start_date'), '%Y-%m-%d').date()
            end_date = datetime.strptime(request.data.get('end_date'), '%Y-%m-%d').date()
            
            # Validate date range (end_date must be after start_date)
            if end_date < start_date:
                return Response(
                    {"error": "End date cannot be before start date"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Get meal type and servings
            meal_type = request.data.get('meal_type')
            servings = float(request.data.get('servings', 1))
            
            # Create meal records for each day in the range (start_date to end_date)
            created_records = []
            current_date = start_date
            while current_date <= end_date:
                meal_record = MealRecord.objects.create(
                    user=request.user,
                    date=current_date,
                    meal_type=meal_type,
                    food=food,
                    servings=servings
                )
                
                # Add record to response for each day in the range
                created_records.append({
                    "id": meal_record.id,
                    "date": current_date.isoformat(),
                    "meal_type": meal_record.meal_type,
                    "food_id": food_id,
                    "servings": servings,
                    "nutrients": meal_record.get_nutrients()
                })
                
                # Move to next day
                current_date += timedelta(days=1)
            
            return Response({
                "message": f"Created {len(created_records)} meal records",
                "records": created_records
            }, status=status.HTTP_201_CREATED)
            
        except FoodProduct.DoesNotExist:
            return Response(
                {"error": f"Food product with ID {food_id} not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValueError as e:
            # Handle date parsing errors and other value errors
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            # Catch-all for other errors
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
