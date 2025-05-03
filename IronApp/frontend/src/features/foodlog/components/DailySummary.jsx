import React from 'react';
import { 
    BarChart, 
    Flame, 
    Beef, 
    Wheat, 
    Droplets, 
    Cookie, 
    Salad, 
    Coffee, 
    UtensilsCrossed, 
    Apple, 
    CalendarCheck 
} from 'lucide-react';

/*
This component displays a summary of the daily nutrition intake.
It shows the breakdown of meals and the macronutrient summary.
*/

const DailySummary = ({ meals, calculateTotalNutrients, calculateDailyTotals }) => {
    const dailyTotals = calculateDailyTotals();

    // Format nutrient values as strings with appropriate units
    const formatNutrient = (value, unit = 'g', decimals = 1) => {
        return `${(value || 0).toFixed(decimals)} ${unit}`;
    };

    // Icons for meal types
    const mealIcons = {
        breakfast: <Coffee size={18} className="text-amber-600" />,
        lunch: <UtensilsCrossed size={18} className="text-green-600" />,
        dinner: <UtensilsCrossed size={18} className="text-blue-600" />,
        snack: <Apple size={18} className="text-red-500" />
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-8 mt-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-[var(--neutral-color-blue)] flex items-center gap-2">
                    <CalendarCheck className="text-[var(--primary-color-teal)]" />
                    <span>Daily Summary</span>
                </h2>
                <div className="text-sm text-gray-500 flex items-center gap-1.5">
                    <BarChart size={16} className="text-[var(--secondary-color-green)]" />
                    <span>Nutrition Analytics</span>
                </div>
            </div>

            {/* Meal Breakdown */}
            <div className="space-y-6 mb-10">
                <h3 className="text-lg font-medium text-[var(--neutral-color-blue)] flex items-center gap-2 pb-2 border-b">
                    <UtensilsCrossed size={18} className="text-[var(--secondary-color-green)]" />
                    Meal Breakdown
                </h3>

                {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                    const mealNutrients = calculateTotalNutrients(mealType);
                    const totalItems = meals[mealType].length;

                    return (
                        <div key={mealType} className="border-b pb-6 last:border-b-0 hover:bg-gray-50 p-4 rounded-lg transition-colors">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-medium capitalize flex items-center gap-2">
                                    {mealIcons[mealType]}
                                    {mealType}
                                </h4>
                                <div className="bg-[var(--primary-color-teal)]/10 py-1 px-3 rounded-full text-[var(--primary-color-teal)] font-medium flex items-center gap-1.5">
                                    <Flame size={16} className="text-orange-500" />
                                    {Math.round(mealNutrients.calories || 0)} kcal
                                </div>
                            </div>

                            {totalItems === 0 ? (
                                <div className="text-gray-500 text-sm bg-gray-50 p-3 rounded-lg text-center">No items logged</div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        <div className="text-center bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="text-sm text-gray-500 flex items-center justify-center gap-1 mb-1">
                                                <Beef size={14} className="text-red-600" />
                                                <span>Protein</span>
                                            </div>
                                            <div className="font-medium text-gray-800">{formatNutrient(mealNutrients.protein)}</div>
                                        </div>
                                        <div className="text-center bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="text-sm text-gray-500 flex items-center justify-center gap-1 mb-1">
                                                <Wheat size={14} className="text-amber-600" />
                                                <span>Carbs</span>
                                            </div>
                                            <div className="font-medium text-gray-800">{formatNutrient(mealNutrients.carbs)}</div>
                                        </div>
                                        <div className="text-center bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="text-sm text-gray-500 flex items-center justify-center gap-1 mb-1">
                                                <Droplets size={14} className="text-blue-600" />
                                                <span>Fat</span>
                                            </div>
                                            <div className="font-medium text-gray-800">{formatNutrient(mealNutrients.fat)}</div>
                                        </div>
                                        <div className="text-center bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="text-sm text-gray-500 flex items-center justify-center gap-1 mb-1">
                                                <Cookie size={14} className="text-pink-600" />
                                                <span>Sugar</span>
                                            </div>
                                            <div className="font-medium text-gray-800">{formatNutrient(mealNutrients.sugar)}</div>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-500 flex items-center justify-end">
                                        <span className="bg-gray-100 py-1 px-2 rounded-md">
                                            {totalItems} item{totalItems !== 1 ? 's' : ''} logged
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                    );
                })}
            </div>

            {/* Macronutrient Summary */}
            <h2 className="text-xl font-semibold text-[var(--neutral-color-blue)] mb-6 flex items-center gap-2 pb-2 border-b">
                <BarChart size={20} className="text-[var(--secondary-color-green)]" />
                Daily Nutrition Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center shadow-sm border border-blue-200">
                    <div className="flex justify-center mb-2">
                        <Flame size={28} className="text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-[var(--primary-color-blue)] mb-1">
                        {Math.round(dailyTotals.calories || 0)}
                    </div>
                    <div className="text-gray-600 mt-1">Total Calories</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center shadow-sm border border-green-200">
                    <div className="flex justify-center mb-2">
                        <Beef size={28} className="text-red-600" />
                    </div>
                    <div className="text-3xl font-bold text-[var(--secondary-color-green)] mb-1">
                        {formatNutrient(dailyTotals.protein)}
                    </div>
                    <div className="text-gray-600 mt-1">Protein</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 text-center shadow-sm border border-amber-200">
                    <div className="flex justify-center mb-2">
                        <Wheat size={28} className="text-amber-600" />
                    </div>
                    <div className="text-3xl font-bold text-[var(--accent-color-orange)] mb-1">
                        {formatNutrient(dailyTotals.carbs)}
                    </div>
                    <div className="text-gray-600 mt-1">Carbohydrates</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 text-center shadow-sm border border-blue-200">
                    <div className="flex justify-center mb-2">
                        <Droplets size={28} className="text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-700 mb-1">
                        {formatNutrient(dailyTotals.fat)}
                    </div>
                    <div className="text-gray-600 mt-1">Fats</div>
                </div>
            </div>

        </div>
    );
};

export default DailySummary; 