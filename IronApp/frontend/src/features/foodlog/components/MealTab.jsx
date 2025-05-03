import React from 'react';
import { Trash2, UtensilsCrossed, Coffee, Apple, Flame, Beef, Wheat, Droplets, Cookie, Salad } from 'lucide-react';

/*
MealTab component displays the meal items and nutrition summary for a specific meal type.
*/

const MealTab = ({ mealType, mealItems, handleRemoveFood, calculateTotalNutrients }) => {
    const formatNutrient = (value, unit = 'g', decimals = 1) => {
        return `${(value || 0).toFixed(decimals)} ${unit}`;
    };

    // Icons for meal types
    const mealIcons = {
        breakfast: <Coffee size={20} />,
        lunch: <UtensilsCrossed size={20} />,
        dinner: <UtensilsCrossed size={20} />,
        snack: <Apple size={20} />
    };

    // Icons for nutrients
    const nutrientIcons = {
        calories: <Flame size={16} />,
        protein: <Beef size={16} />,
        carbs: <Wheat size={16} />,
        fat: <Droplets size={16} />
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-[var(--neutral-color-blue)] capitalize mb-6 flex items-center gap-2">
                {mealIcons[mealType]}
                <span>{mealType} Log</span>
            </h2>

            {mealItems.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-center mb-3">
                        {mealIcons[mealType]}
                    </div>
                    <p className="font-medium">No food items logged for {mealType} yet.</p>
                    <p className="text-sm mt-2 text-gray-400">Search for food to add it to your log.</p>
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-[1fr,auto] gap-2 font-medium text-sm text-gray-600 px-3 pb-3 mb-4 border-b">
                        <div className="flex items-center gap-1">
                            <Cookie size={16} />
                            <span>Food Item</span>
                        </div>
                        <div className="text-right flex items-center gap-1">
                            <Flame size={16} className="text-orange-500" />
                            <span>Nutrition</span>
                        </div>
                    </div>

                    {/* Meal Items */}
                    <div className="space-y-3 mb-6">
                        {mealItems.map((food, index) => (
                            <div key={index}
                                className="grid grid-cols-[1fr,auto] items-center bg-gray-50 rounded-lg p-3 hover:bg-gray-100 border border-gray-100 transition-all"
                            >
                                <div className="flex items-center">
                                    {food.image_url && (
                                        <img
                                            src={food.image_url}
                                            alt={food.product_name_en || food.product_name}
                                            className="w-10 h-10 object-cover rounded-md mr-3 border border-gray-200 shadow-sm"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <div>
                                        <div className="font-medium text-gray-800">{food.product_name_en || food.product_name}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{food.brands}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 bg-white py-1.5 px-3 rounded-lg shadow-sm border border-gray-100">
                                    <div className="text-sm font-medium flex items-center gap-1 text-orange-600">
                                        <Flame size={14} />
                                        {Math.round(food.nutriments?.['energy-kcal_serving'] || 0)} kcal
                                    </div>
                                    <div className="text-xs flex items-center gap-1">
                                        <Beef size={12} className="text-red-700" />
                                        {food.nutriments?.['proteins_serving']?.toFixed(1) ?? '0.0'}g
                                    </div>
                                    <div className="text-xs flex items-center gap-1">
                                        <Wheat size={12} className="text-amber-600" />
                                        {food.nutriments?.['carbohydrates_serving']?.toFixed(1) ?? '0.0'}g
                                    </div>
                                    <div className="text-xs flex items-center gap-1">
                                        <Droplets size={12} className="text-blue-600" />
                                        {food.nutriments?.['fat_serving']?.toFixed(1) ?? '0.0'}g
                                    </div>
                                    <div className="text-xs hidden md:flex items-center gap-1">
                                        <Cookie size={12} className="text-pink-600" />
                                        S: {food.nutriments?.['sugars_serving']?.toFixed(1) ?? '0.0'} g
                                    </div>
                                    <div className="text-xs hidden md:flex items-center gap-1">
                                        <Salad size={12} className="text-green-600" />
                                        Fib: {food.nutriments?.['fiber_serving']?.toFixed(1) ?? '0.0'} g
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFood(mealType, index)}
                                        className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-full transition-colors"
                                        aria-label={`Remove ${food.product_name_en || food.product_name}`}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Meal Nutrition Summary */}
                    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-5 border border-blue-100 shadow-sm">
                        <h3 className="font-medium text-[var(--primary-color-blue)] mb-4 flex items-center gap-2 ">
                            <Flame size={18} />
                            {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Nutrition Summary
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-sm">
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <div className="font-medium text-gray-900 flex items-center gap-1 mb-1">
                                    <Flame size={16} className="text-orange-500" />
                                    {Math.round(calculateTotalNutrients(mealType).calories || 0)}
                                </div>
                                <div className="text-gray-600">Calories</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                                <div className="font-medium text-gray-900 flex items-center gap-1 mb-1">
                                    <Beef size={16} className="text-red-600" />
                                    {formatNutrient(calculateTotalNutrients(mealType).protein)}
                                </div>
                                <div className="text-gray-600">Protein</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-sm">
                                <div className="font-medium text-gray-900 flex items-center gap-1 mb-1">
                                    <Wheat size={16} className="text-amber-600" />
                                    {formatNutrient(calculateTotalNutrients(mealType).carbs)}
                                </div>
                                <div className="text-gray-600">Carbs</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <div className="font-medium text-gray-900 flex items-center gap-1 mb-1">
                                    <Droplets size={16} className="text-blue-600" />
                                    {formatNutrient(calculateTotalNutrients(mealType).fat)}
                                </div>
                                <div className="text-gray-600">Fat</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <div className="font-medium text-gray-900 flex items-center gap-1 mb-1">
                                    <Cookie size={16} className="text-pink-600" />
                                    {formatNutrient(calculateTotalNutrients(mealType).sugar)}
                                </div>
                                <div className="text-gray-600">Sugar</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <div className="font-medium text-gray-900 flex items-center gap-1 mb-1">
                                    <Salad size={16} className="text-green-600" />
                                    {formatNutrient(calculateTotalNutrients(mealType).fiber)}
                                </div>
                                <div className="text-gray-600">Fiber</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealTab; 