import React, { useState } from 'react';
import { Calendar, X, ChevronLeft, ChevronRight, Trash2, Info } from 'lucide-react';
import DateRangeInput from './DateRangeInput';
import MealTypeSelection from './MealTypeSelection';

const TrackedFoodList = ({ trackedFoods, mealIcons, handleRemoveTrackedFood }) => {
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = useState(DateRangeInput.startOfWeek(today));
  const currentWeekEnd = DateRangeInput.endOfWeek(currentWeekStart);

  // Filter foods for the current week, checking if the food startDate is in this week
  const foodsThisWeek = trackedFoods.filter(food => {
    try {
      return DateRangeInput.isDateInWeek(food.startDate, currentWeekStart, currentWeekEnd);
    } catch (error) {
      return false;
    }
  });

  // Group foods by meal type
  const foodsByMealType = foodsThisWeek.reduce((acc, food) => {
    if (!acc[food.mealType]) {
      acc[food.mealType] = [];
    }
    acc[food.mealType].push(food);
    return acc;
  }, {});

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return DateRangeInput.startOfWeek(d);
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return DateRangeInput.startOfWeek(d);
    });
  };

  // Delete all foods for the current week
  const handleDeleteAllForWeek = () => {
    const foodIdsToDelete = foodsThisWeek.map(food => food.id);
    
    if (foodIdsToDelete.length === 0) return;
    
    // Ask for confirmation before deleting all foods for the current week
    if (window.confirm(`Delete all ${foodIdsToDelete.length} food items for this week?`)) {
      foodIdsToDelete.forEach(id => handleRemoveTrackedFood(id));
    }
  };

  const hasMealsPlanned = foodsThisWeek.length > 0; // Checks if there are any foods planned for the current week
  
  // Format the week range for display
  const weekRangeDisplay = DateRangeInput.formatDateRange(currentWeekStart, currentWeekEnd);

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <Calendar size={18} className="text-[var(--primary-color-teal)]" />
          <span>Weekly Meal Tracker</span>
          {trackedFoods.length > 0 && (
            <span className="text-xs text-gray-500 ml-2">
              ({foodsThisWeek.length} of {trackedFoods.length} total items)
            </span>
          )}
        </h3>
        <div className="flex items-center gap-1">
          <button 
            onClick={handlePrevWeek} 
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
            aria-label="Previous week"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-600 px-2">
            {weekRangeDisplay}
          </span>
          <button 
            onClick={handleNextWeek} 
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
            aria-label="Next week"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {trackedFoods.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded border border-dashed border-gray-200">
          <Calendar size={24} className="mx-auto text-gray-400 mb-1" />
          <p className="text-gray-500 text-sm">No foods tracked yet</p>
        </div>
      ) : !hasMealsPlanned ? (
        <div className="text-center py-8 bg-gray-50 rounded border border-dashed border-gray-200">
          <Calendar size={24} className="mx-auto text-gray-400 mb-1" />
          <p className="text-gray-500 text-sm">No meals planned for this week</p>
          <p className="text-xs text-gray-400 mt-1">Try changing the week or adding more foods</p>
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleDeleteAllForWeek}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
              title="Delete all items for this week"
            >
              <Trash2 size={14} />
              <span>Delete All ({foodsThisWeek.length})</span>
            </button>
          </div>

          <div className="max-h-[28rem] overflow-y-auto pr-1">
            <div className="space-y-4">
              {Object.entries(foodsByMealType).length > 0 ? (
                MealTypeSelection.sortMealTypeEntries(Object.entries(foodsByMealType)).map(([mealType, foods]) => (
                  <div key={mealType} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-white p-3 border-b flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--primary-color-teal)] bg-opacity-10 text-[var(--primary-color-teal)]">
                          {mealIcons[mealType]}
                        </span>
                        <span className="font-medium capitalize">{mealType}</span>
                        <span className="text-xs text-gray-500">({foods.length} items)</span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {foods.map(food => (
                        <div 
                          key={food.id} 
                          className="p-3 hover:bg-white transition-colors"
                        >
                          <div className="flex justify-between">
                            <div className="flex-grow">
                              <div className="font-medium text-gray-800">
                                {food.food.product_name_en}
                              </div>
                              
                              <div className="mt-1 text-sm text-gray-500">
                                {food.food.brands}
                              </div>

                              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                                <span className="text-gray-500">
                                  <span className="font-medium">Range:</span> {DateRangeInput.formatUserDate(food.startDate)} - {DateRangeInput.formatUserDate(food.endDate)}
                                </span>
                                
                                {food.recordCount && (
                                  <span className="text-green-500 flex items-center gap-0.5">
                                    <Info size={12} />
                                    {food.recordCount} meals tracked
                                  </span>
                                )}
                                
                                <span className="text-blue-600">
                                  {Math.round(food.food.nutriments?.['energy_kcal_serving'] || 0)} kcal
                                </span>
                                
                                <span className="text-green-600">
                                  {Math.round(food.food.nutriments?.proteins_serving || 0)}g protein
                                </span>

                                <span className="text-yellow-600">
                                  {Math.round(food.food.nutriments?.carbohydrates_serving || 0)}g carbs
                                </span>

                                <span className="text-red-600">
                                  {Math.round(food.food.nutriments?.fat_serving || 0)}g fat
                                </span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveTrackedFood(food.id)}
                              className="text-gray-400 hover:text-red-500 p-1 self-start"
                              title="Remove"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No meal categories for this week</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackedFoodList; 