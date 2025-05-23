import { useState } from 'react';
import api from '../../auth/api';

/* 
Custom hook for managing grocery list generation functionality.
This hook handles the state management for date range selection,
API calls to the backend ingredients endpoint, and data formatting.
It validates user input and provides loading/error states for the UI.
*/
const useGroceryList = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [groceryData, setGroceryData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Validate that both dates are provided and start date is not after end date
    const validateDates = () => {
        if (!startDate || !endDate) {
            setError('Please select both start and end dates.');
            return false;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError('Start date must be before or equal to end date.');
            return false;
        }

        return true;
    };

    // Main function to generate grocery list from backend API
    const generateGroceryList = async () => {
        if (!validateDates()) {
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const response = await api.get('/food/ingredients/', {
                params: {
                    start_date: startDate,
                    end_date: endDate
                }
            });
            setGroceryData(response.data);
        } catch (err) {
            console.error('Error fetching grocery data:', err);
            setError(err.response?.data?.error || 'Failed to generate grocery list. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Clear all grocery data and reset error state
    const clearData = () => {
        setGroceryData(null);
        setError(null);
    };

    // Format date strings for display in UI
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const exportFoodItems = () => {
        if (!groceryData || !groceryData.food_items) return;

        // Format food items data as text
        let textContent = `FOOD ITEMS - GROCERY LIST\n`;
        textContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
        textContent += `Date Range: ${formatDate(groceryData.date_range.start_date)} - ${formatDate(groceryData.date_range.end_date)}\n`;
        textContent += `Total Items: ${groceryData.food_items.length}\n\n`;
        textContent += `${'='.repeat(50)}\n\n`;

        groceryData.food_items.forEach((food, index) => {
            textContent += `${index + 1}. ${food.product_name_en || 'Unknown Product'}\n`;
            if (food.brands) textContent += `   Brand: ${food.brands}\n`;
            textContent += `   Servings: ${food.total_servings}\n`;
            textContent += `\n`;
        });

        // Create and download the file
        const element = document.createElement("a");
        const file = new Blob([textContent], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = `grocery-food-items-${startDate}-to-${endDate}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);
    };

    /* Export Ingredients */
    const exportIngredients = () => {
        if (!groceryData || !groceryData.ingredients) return;

        // Format ingredients data as text
        let textContent = `INGREDIENTS - SHOPPING LIST\n`;
        textContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
        textContent += `Date Range: ${formatDate(groceryData.date_range.start_date)} - ${formatDate(groceryData.date_range.end_date)}\n`;
        textContent += `Total Ingredients: ${groceryData.ingredients.length}\n\n`;
        textContent += `${'='.repeat(50)}\n\n`;

        groceryData.ingredients.forEach((ingredient, index) => {
            textContent += `☐ ${ingredient}\n`;
        });

        // Create blob and download link
        // A blob is a file-like object that can be used to create a download link
        const blob = new Blob([textContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `grocery-ingredients-${startDate}-to-${endDate}.txt`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Export complete grocery list (both food items and ingredients)
    const exportCompleteList = () => {
        if (!groceryData) return;

        let textContent = `COMPLETE GROCERY LIST\n`;
        textContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
        textContent += `Date Range: ${formatDate(groceryData.date_range.start_date)} - ${formatDate(groceryData.date_range.end_date)}\n\n`;
        textContent += `Summary:\n`;
        textContent += `- Food Items: ${groceryData.total_food_items}\n`;
        textContent += `- Unique Ingredients: ${groceryData.total_ingredients}\n\n`;
        textContent += `${'='.repeat(60)}\n\n`;

        // Add food items section
        textContent += `FOOD ITEMS (${groceryData.food_items.length})\n`;
        textContent += `${'-'.repeat(30)}\n`;
        groceryData.food_items.forEach((food, index) => {
            textContent += `${index + 1}. ${food.product_name_en || 'Unknown Product'}\n`;
            if (food.brands) textContent += `   Brand: ${food.brands}\n`;
            textContent += `   Servings: ${food.total_servings}\n\n`;
        });

        // Add ingredients section
        textContent += `\n${'='.repeat(60)}\n\n`;
        textContent += `SHOPPING LIST - INGREDIENTS (${groceryData.ingredients.length})\n`;
        textContent += `${'-'.repeat(40)}\n`;
        groceryData.ingredients.forEach((ingredient, index) => {
            textContent += `☐ ${ingredient}\n`;
        });

        // Create and download the file
        const element = document.createElement("a");
        const file = new Blob([textContent], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = `complete-grocery-list-${startDate}-to-${endDate}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);
    };

    return {
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        groceryData,
        isLoading,
        error,
        generateGroceryList,
        clearData,
        formatDate,
        exportFoodItems,
        exportIngredients,
        exportCompleteList
    };
};

export default useGroceryList; 