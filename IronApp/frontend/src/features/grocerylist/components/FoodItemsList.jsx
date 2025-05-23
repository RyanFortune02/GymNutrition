import React from 'react';
import { Package } from 'lucide-react';

/* Food Items List Component
    This component displays all the food items that were consumed during
    the selected date range. Each food item shows an image, name, brand,
    and total servings consumed. 
*/
const FoodItemsList = ({ foodItems = [] }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                <Package className="text-[var(--primary-color-teal)]" size={24} />
                Food Items ({foodItems.length})
            </h2>
            
            {foodItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {foodItems.map((food, index) => (
                        <div key={`${food.id}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3">
                                {/* Food Item Image */}
                                {food.image_url && (
                                    <img 
                                        src={food.image_url} 
                                        alt={food.product_name_en}
                                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                    />
                                )}
                                <div className="flex-1">
                                    {/* Food Item Details */}
                                    <h3 className="font-medium text-gray-900 text-sm mb-1">
                                        {food.product_name_en || 'Unknown Product'}
                                    </h3>
                                    <p className="text-xs text-gray-600 mb-2">
                                        {food.brands}
                                    </p>
                                    {/* Serving Count Badge */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs bg-[var(--primary-color-teal)] text-white px-2 py-1 rounded">
                                            {food.total_servings} servings
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">No food items found for the selected date range.</p>
            )}
        </div>
    );
};

export default FoodItemsList; 