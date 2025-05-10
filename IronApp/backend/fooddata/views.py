from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openfoodfacts import API, Environment, Country, APIVersion
from datetime import date

from .serializers import FoodProductSerializer
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
            products = []
            if "code" in request.GET:
                code = request.GET.get("code")
                result = api.product.get(code=code)

                if not result:
                    return Response(
                        {"error": "Product not found"},
                        status=status.HTTP_404_NOT_FOUND,
                    )
                products = [result]
            else:
                result = api.product.text_search(
                    query=request.GET["search"],
                    page=int(request.GET.get("page", 1)),
                    page_size=int(request.GET.get("page_size", 20)),
                )

                if not result or "products" not in result:
                    return Response(
                        {"error": "No products found"},
                        status=status.HTTP_404_NOT_FOUND,
                    )

                products = result["products"]

            food_products = []
            response_data = {}
            for product_data in products:
                # Create or update the FoodProduct
                food_product, _ = FoodProduct.objects.update_or_create(
                    id=product_data.get("_id"),
                    defaults={
                        "product_name_en": product_data.get(
                            "product_name_en", ""
                        ),
                        "serving_size": product_data.get("serving_size", ""),
                        "nutriments": product_data.get("nutriments", {}),
                    },
                )
                serializer = FoodProductSerializer(food_product)
                food_products.append(serializer.data)

                # Create MealRecord if meal_type is provided
                meal_record = None
                if "meal_type" in request.GET:
                    meal_record, _ = MealRecord.objects.update_or_create(
                        user=request.user,
                        date=request.GET.get("date", date.today()),
                        meal_type=request.GET.get("meal_type"),
                        food=food_product,
                        defaults={
                            "servings": float(request.GET.get("servings", 1))
                        },
                    )
                if meal_record:
                    response_data["meal_record"].append(
                        {
                            "date": meal_record.date,
                            "meal_type": meal_record.meal_type,
                            "servings": float(meal_record.servings),
                            "nutrients": meal_record.get_nutrients(),
                        }
                    )

            # Return response
            response_data["results"] = food_products

            return Response(response_data)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
