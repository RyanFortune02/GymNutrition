from django.views import View
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
from django.http import JsonResponse
from openfoodfacts import API, Environment, Country, APIVersion

from .serializers import FoodProductSerializer
from .models import FoodProduct


class OpenFoodFactsSearchView(View):
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

    @method_decorator(csrf_exempt, name="dispatch")
    @method_decorator(require_http_methods(["GET"]), name="dispatch")
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

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

    def get(self, request, *args, **kwargs):
        """
        Handle GET requests for OpenFoodFacts searches.
        """

        try:
            # Initialize API client
            api = self.initialize_api()
            if not api:
                return JsonResponse({"error": "API initialization failed"}, status=500)

            products = []

            # Handle barcode search
            if "code" in request.GET:
                fields = [
                    "_id",
                    "_keywords",
                    "allergens_tags",
                    "brands",
                    "categories_imported",
                    "complete",
                    "image_url",
                    "ingredients_text_en",
                    "product_name_en",
                    "nutriments",
                    "serving_size",
                ]

                cache_key = f"off_{request.GET['code']}"
                cached_result = cache.get(cache_key)
                if cached_result:
                    return JsonResponse(cached_result)

                result = api.product.get(
                    code=request.GET["code"], fields=fields, raise_if_invalid=True
                )

                if not result:
                    return JsonResponse({"error": "Product not found"}, status=404)
                products = [result]

            # Handle text search
            else:
                cache_key = f"off_{request.GET['search']}_{request.GET.get('page', 1)}"
                cached_result = cache.get(cache_key)
                if cached_result:
                    return JsonResponse(cached_result)

                result = api.product.text_search(
                    query=request.GET["search"],
                    page=int(request.GET.get("page", 1)),
                    page_size=int(request.GET.get("page_size", 20)),
                )

                if not result or "products" not in result:
                    return JsonResponse({"error": "No products found"}, status=404)
                products = result["products"]

            # Convert products to FoodProduct instances
            food_products = []
            for product_data in products:
                product = FoodProduct(
                    id=product_data.get("_id", ""),
                    keywords=product_data.get("_keywords", []),
                    allergens_tags=product_data.get("allergens_tags", []),
                    brands=product_data.get("brands", ""),
                    categories_imported=product_data.get("categories_imported", ""),
                    complete=product_data.get("complete"),
                    image_url=product_data.get("image_url", ""),
                    ingredients_text_en=product_data.get("ingredients_text_en", ""),
                    product_name_en=product_data.get("product_name_en", ""),
                    nutriments=product_data.get("nutriments", {}),
                    serving_size=product_data.get("serving_size", ""),
                )

                serializer = FoodProductSerializer(product)
                food_products.append(serializer.data)

            # Cache the result
            cache.set(
                cache_key,
                {"results": food_products},
                60 * 60,  # Cache for 1 hour
            )

            return JsonResponse({"results": food_products})

        except Exception as e:
            cache.clear()
            return JsonResponse({"error": str(e)}, status=500)
