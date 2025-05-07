from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openfoodfacts import API, Environment, Country, APIVersion
from datetime import date

from .models import FoodProduct
from api.models import MealRecord


class OpenFoodFactsSearchView(APIView):
    """
    Search OpenFoodFacts database using the official SDK and convert results to
    FoodProduct model.

    Args:
        request (HttpRequest): Django request object
        request.GET:
            - code: Barcode number (for single product lookup)
            OR
            - search: Search query string (for text search)
            - page: Page number for text search results (default: 1)
            - page_size: Number of results per page (default: 20)

    Returns:
        Response: List of FoodProduct instances matching search criteria

    Examples:
        # Barcode search
        GET /food/search/?code=7622210449283

        # Text search
        GET /food/search/?search=nutella&page=1&page_size=20
    """

    def initialize_api(self):
        """
        Initialize OpenFoodFacts API client.
        """

        try:
            return API(
                user_agent="GymNutrition/0.1",
                version=APIVersion.v2,
                environment=Environment.org,
                country=Country.us,
            )
        except Exception as e:
            print(f"API initialization error: {str(e)}")
            return None

    def get(self, request):
        try:
            api = self.initialize_api()
            if not api:
                return Response(
                    {"error": "API initialization failed"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            code = request.GET.get("code")
            if not code:
                return Response(
                    {"error": "No code provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            result = api.product.get(code=code)

            if not result:
                return Response(
                    {"error": "Product not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Create or update the FoodProduct
            food_product, _ = FoodProduct.objects.update_or_create(
                id=code,
                defaults={
                    "product_name_en": result.get("product_name_en", ""),
                    "serving_size": result.get("serving_size", ""),
                    "nutriments": result.get("nutriments", {}),
                },
            )

            # Create MealRecord if meal_type is provided
            meal_record = None
            if request.GET.get("meal_type"):
                meal_record, _ = MealRecord.objects.update_or_create(
                    user=request.user,
                    date=request.GET.get("date", date.today()),
                    meal_type=request.GET.get("meal_type"),
                    food=food_product,
                    defaults={
                        "servings": float(request.GET.get("servings", 1))
                    },
                )

            # Return response
            response_data = {
                "results": {
                    "code": food_product.id,
                    "name": food_product.product_name_en,
                    "serving_size": food_product.serving_size,
                    "nutriments": food_product.nutriments,
                }
            }

            if meal_record:
                response_data["meal_record"] = {
                    "date": meal_record.date,
                    "meal_type": meal_record.meal_type,
                    "servings": float(meal_record.servings),
                    "nutrients": meal_record.get_nutrients(),
                }

            return Response(response_data)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
