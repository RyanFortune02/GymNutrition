import React from 'react';
import { Download } from 'lucide-react';

/* Grocery Summary Component
    This component displays a summary overview of the generated grocery list.
    It shows total counts for food items and ingredients.
*/
const GrocerySummary = ({ groceryData, formatDate, onExportComplete }) => {
    // Don't render anything if no grocery data is available
    if (!groceryData) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Grocery List Summary
                </h2>
                {/* Export Complete List Button */}
                {onExportComplete && (
                    <button
                        onClick={onExportComplete}
                        className="flex items-center gap-2 bg-[var(--secondary-color-green)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-color-teal)] transition-colors text-sm font-medium"
                    >
                        <Download size={16} />
                        Export Complete List
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Food Items Count */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{groceryData.total_food_items}</div>
                    <div className="text-blue-700">Food Items</div>
                </div>
                {/* Ingredients Count */}
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{groceryData.total_ingredients}</div>
                    <div className="text-green-700">Unique Ingredients</div>
                </div>
                {/* Date Range Display */}
                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-purple-700">Date Range</div>
                    <div className="text-purple-600">
                        {formatDate(groceryData.date_range.start_date)} - {formatDate(groceryData.date_range.end_date)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrocerySummary; 