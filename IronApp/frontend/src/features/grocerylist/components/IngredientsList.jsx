import React from 'react';
import { List, Download } from 'lucide-react';

/* Ingredients List Component
    This component displays all unique ingredients found in the food items
    consumed during the selected date range. This helps users create their shopping list.
*/
const IngredientsList = ({ ingredients = [], onExport }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    <List className="text-[var(--primary-color-teal)]" size={24} />
                    Ingredients List ({ingredients.length})
                </h2>
                {/* Export Button */}
                {ingredients.length > 0 && onExport && (
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 bg-[var(--primary-color-teal)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color-green)] transition-colors text-sm font-medium"
                    >
                        <Download size={16} />
                        Export as TXT
                    </button>
                )}
            </div>
            
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