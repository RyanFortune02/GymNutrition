from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from openfoodfacts import API, Environment, Country, APIVersion
from datetime import date, datetime
import logging
from requests.exceptions import Timeout, ConnectionError, RequestException

from .serializers import FoodProductSerializer
from .models import FoodProduct, UserRecentFood
from api.models import MealRecord

# Get an instance of a logger
logger = logging.getLogger(__name__)

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
                timeout=30, # added timeout for api requests
            )
        except Exception as e:
            logger.error("OpenFoodFacts API initialization failed.")
            return None

    def get(self, request):
        try:
            api = self.initialize_api()
            if not api:
                logger.error("OpenFoodFacts API initialization failed.")
                return Response(
                    {"error": "Food database connection failed. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            products = []
            # ------------- Start API Call
            
            if "code" in request.GET:
                code = request.GET.get("code")
                result = api.product.get(code=code)

                if not result:
                    return Response(
                        {"error": "Product not found for the given barcode."},
                        status=status.HTTP_404_NOT_FOUND,
                    )
                products = [result]
            else:
                search_term = request.GET.get("search")
                if not search_term:
                    return Response({"error": "Search term is required."}, status=status.HTTP_400_BAD_REQUEST)
                    
                result = api.product.text_search(
                    query=search_term,
                    page=int(request.GET.get("page", 1)),
                    page_size=int(request.GET.get("page_size", 20)),
                )

                if not result or "products" not in result or not result["products"]:
                    return Response(
                        {"error": "No products found matching your search."},
                        status=status.HTTP_404_NOT_FOUND,
                    )

                products = result["products"]
            # ------------  End API Call

            food_products = []
            response_data = {}
            # Initialize meal_record list if needed
            if "meal_type" in request.GET:
                 response_data["meal_record"] = []
                 
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
                        "brands": product_data.get("brands", ""),
                        "image_url": product_data.get("image_url", ""),
                        "ingredients_text_en": product_data.get("ingredients_text_en", ""),
                        "categories_imported": product_data.get("categories_imported", ""),
                        "complete": product_data.get("complete", False),
                        "keywords": product_data.get("_keywords", []),
                        "allergens_tags": product_data.get("allergens_tags", []),
                    },
                )
                serializer = FoodProductSerializer(food_product)
                food_products.append(serializer.data)

                # Create MealRecord if meal_type is provided
                meal_record = None
                if "meal_type" in request.GET:
                    # Basic validation for meal_type and servings might be needed here
                    meal_record, _ = MealRecord.objects.update_or_create(
                        user=request.user,
                        date=request.GET.get("date", date.today()),
                        meal_type=request.GET.get("meal_type"),
                        food=food_product,
                        defaults={
                            "servings": float(request.GET.get("servings", 1))
                        },
                    )
                # This check prevents KeyError if meal_record wasn't created but response_data['meal_record'] exists
                if meal_record and "meal_record" in response_data:
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

        #specific network/api error handling
        except Timeout:
            #api took too long
            logger.warning("Timeout connecting to OpenFoodFacts API", exc_info=True) # Log with traceback
            return Response(
                {"error": "Food database search timed out. Please try again."}, 
                status=status.HTTP_504_GATEWAY_TIMEOUT
            )
        except ConnectionError:
            #couldnt connect to api
            logger.warning("Could not connect to OpenFoodFacts API", exc_info=True) # Log with traceback
            return Response(
                {"error": "Could not connect to the food database. Please check your network or try again later."}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except RequestException as e: # Catch other request-related errors (e.g., from OpenFoodFacts server)
            #api had some other problem
            logger.error(f"OpenFoodFacts API request failed: {e}", exc_info=True) # Log with traceback
            return Response(
                {"error": "The food database returned an unexpected error. Please try again later."}, 
                status=status.HTTP_502_BAD_GATEWAY
            )
        #generic error handling
        except Exception as e:
            #something else went wrong
            logger.error(f"An unexpected error occurred in food search: {e}", exc_info=True) # Log with traceback
            return Response(
                # Avoid exposing raw error details to the user in production
                {"error": "An unexpected error occurred during the search. Please try again."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

'''
# New View for Recent Foods 
'''
class UserRecentFoodView(APIView):
    # require user to be logged in
    permission_classes = [permissions.IsAuthenticated]

    # get the list of 10 most recent foods
    def get(self, request):
        # get recent records for the current user, ordered by latest first
        recent_records = UserRecentFood.objects.filter(user=request.user).order_by('-accessed_at')[:10]
        # get the actual food product objects linked by these records
        recent_food_products = [record.food_product for record in recent_records]
        # serialize the food product data
        serializer = FoodProductSerializer(recent_food_products, many=True)
        return Response(serializer.data)

    # add a food item to the user's recent list
    def post(self, request):
        food_product_id = request.data.get('food_product_id')
        if not food_product_id:
            return Response({"error": "food_product_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        # check if the food product exists manually
        try:
            food_product = FoodProduct.objects.get(id=food_product_id)
        except FoodProduct.DoesNotExist:
            # return 404 if food product not found in our db
            return Response({"error": "Food product not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
             # handle other potential errors during lookup
             logger.error(f"Error looking up FoodProduct {food_product_id}: {e}", exc_info=True)
             return Response({"error": "Error finding food product."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # add or update the recent food record (auto_now=True updates accessed_at)
        recent_food, created = UserRecentFood.objects.update_or_create(
            user=request.user,
            food_product=food_product,
            # defaults={'accessed_at': timezone.now()} # Not needed due to auto_now=True
        )

        # maintain only the 10 most recent items
        recent_items_count = UserRecentFood.objects.filter(user=request.user).count()
        if recent_items_count > 10:
            # find the ids of the oldest items to remove
            ids_to_delete = UserRecentFood.objects.filter(user=request.user).order_by('accessed_at').values_list('id', flat=True)[:recent_items_count - 10]
            # delete the oldest records
            UserRecentFood.objects.filter(pk__in=list(ids_to_delete)).delete()

        # return success response
        return Response({"message": f"Food product {food_product_id} added/updated in recents."}, status=status.HTTP_200_OK)

'''
# Date Range Ingredients View
'''
class DateRangeIngredientsView(APIView):
    """
    Get ingredients and food items for a date range
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            # get required parameters
            start_date = request.GET.get('start_date')
            end_date = request.GET.get('end_date')
            
            if not start_date or not end_date:
                return Response({"error": "start_date and end_date are required."}, status=status.HTTP_400_BAD_REQUEST)
            
            # parse and validate dates
            try:
                start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
            except ValueError:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
            
            if start_date_obj > end_date_obj:
                return Response({"error": "start_date must be before or equal to end_date."}, status=status.HTTP_400_BAD_REQUEST)
            
            # get meal records in date range
            meal_records = MealRecord.objects.filter(
                user=request.user,
                date__gte=start_date_obj,
                date__lte=end_date_obj
            ).select_related('food')
            
            if not meal_records.exists():
                return Response({
                    "ingredients": [],
                    "food_items": [],
                    "date_range": {"start_date": start_date, "end_date": end_date},
                    "total_food_items": 0,
                    "total_ingredients": 0
                })
            
            # collect unique food products and ingredients
            unique_foods = {}
            all_ingredients = set()
            
            for record in meal_records:
                food = record.food
                # track unique foods with total servings
                if food.id not in unique_foods:
                    unique_foods[food.id] = {
                        'food_object': food,
                        'total_servings': 0
                    }
                unique_foods[food.id]['total_servings'] += float(record.servings)
                
                # parse ingredients from the food
                if food.ingredients_text_en:
                    ingredients = self.parse_ingredients(food.ingredients_text_en)
                    all_ingredients.update(ingredients)
            
            # prepare food items using serializer
            food_items = []
            for food_id, food_data in unique_foods.items():
                food_obj = food_data['food_object']
                serializer = FoodProductSerializer(food_obj)
                food_item = serializer.data
                food_item['total_servings'] = food_data['total_servings']
                food_items.append(food_item)
            
            # prepare response data
            response_data = {
                "ingredients": sorted(list(all_ingredients)),
                "food_items": food_items,
                "date_range": {
                    "start_date": start_date,
                    "end_date": end_date
                },
                "total_food_items": len(food_items),
                "total_ingredients": len(all_ingredients)
            }
            
            return Response(response_data)

        #specific error handling
        except ValueError as e:
            #date parsing or other value errors
            logger.warning(f"Date range ingredients view value error: {e}", exc_info=True)
            return Response({"error": "Invalid parameter values provided."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            #something else went wrong
            logger.error(f"An unexpected error occurred in date range ingredients view: {e}", exc_info=True)
            return Response(
                {"error": "An unexpected error occurred while processing the request."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def parse_ingredients(self, ingredients_text):
        """
        parse ingredient text into clean list
        """
        if not ingredients_text:
            return []
        
        # common separators used in ingredient lists
        separators = [',', ';', '(', ')', '[', ']', '.']
        
        # convert to lowercase for processing
        text = ingredients_text.lower()
        
        # replace separators with commas
        for sep in separators:
            text = text.replace(sep, ',')
        
        # split and clean ingredients
        ingredients = []
        for item in text.split(','):
            cleaned = item.strip()
            
            # filter out short words, numbers, percentages, e-numbers, common terms
            if (len(cleaned) > 2 and 
                not cleaned.isdigit() and 
                '%' not in cleaned and
                not (cleaned.startswith('e') and len(cleaned) > 1 and cleaned[1:].isdigit()) and
                cleaned not in ['and', 'or', 'may', 'contain', 'traces', 'of']):
                ingredients.append(cleaned.title())
        
        return ingredients
