import React from 'react';
import { List } from 'lucide-react';

/* Ingredients List Component
    This component displays all unique ingredients found in the food items
    consumed during the selected date range. This helps users create their shopping list.
*/
const IngredientsList = ({ ingredients = [] }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                <List className="text-[var(--primary-color-teal)]" size={24} />
                Ingredients List ({ingredients.length})
            </h2>
            
            {ingredients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                            {/* Bullet point indicator */}
                            <div className="w-2 h-2 bg-[var(--primary-color-teal)] rounded-full flex-shrink-0"></div>
                            {/* Ingredient name */}
                            <span className="text-gray-700">{ingredient}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">No ingredients found for the selected date range.</p>
            )}
        </div>
    );
};

export default IngredientsList; 