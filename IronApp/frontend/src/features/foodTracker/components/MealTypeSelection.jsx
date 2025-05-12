import React from 'react';
import { CheckCircle2, Coffee, UtensilsCrossed, Apple } from 'lucide-react';

/*
MealTypeSelection component displays a list of meal types with icons and allows the user to select one or more meal types.
*/

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const getMealIcons = () => ({
    breakfast: <Coffee size={18} />,
    lunch: <UtensilsCrossed size={18} />,
    dinner: <UtensilsCrossed size={18} />,
    snack: <Apple size={18} />
});

const sortMealTypes = (mealTypes) => {
  return mealTypes.sort((a, b) => {
    return MEAL_TYPES.indexOf(a) - MEAL_TYPES.indexOf(b);
  });
};

const sortMealTypeEntries = (mealTypeEntries) => {
  return mealTypeEntries.sort(([typeA], [typeB]) => {
    return MEAL_TYPES.indexOf(typeA) - MEAL_TYPES.indexOf(typeB);
  });
};

const MealTypeSelection = ({ selectedMealTypes, onToggleMealType, mealIcons = getMealIcons() }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Meal Types (Select one or more)
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MEAL_TYPES.map(meal => (
          <button
            type="button"
            key={meal}
            onClick={() => onToggleMealType(meal)}
            className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-2 ${
              selectedMealTypes.includes(meal)
                ? 'bg-[var(--primary-color-teal)] text-white shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {mealIcons[meal]}
            {meal.charAt(0).toUpperCase() + meal.slice(1)}
            {selectedMealTypes.includes(meal) && (
              <CheckCircle2 size={14} className="ml-1" />
            )}
          </button>
        ))}
      </div>
      {selectedMealTypes.length === 0 && (
        <p className="text-xs text-red-500 mt-1">Please select at least one meal type</p>
      )}
    </div>
  );
};

// Attach utility functions and constants to the component for external use
MealTypeSelection.MEAL_TYPES = MEAL_TYPES;
MealTypeSelection.getMealIcons = getMealIcons;
MealTypeSelection.sortMealTypes = sortMealTypes;
MealTypeSelection.sortMealTypeEntries = sortMealTypeEntries;

export default MealTypeSelection; 