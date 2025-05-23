import React from 'react';
import { ShoppingCart } from 'lucide-react';
import NavBar from '../../../components/NavBar';
import useGroceryList from '../hooks/useGroceryList';
import DateRangeForm from '../components/DateRangeForm';
import GrocerySummary from '../components/GrocerySummary';
import FoodItemsList from '../components/FoodItemsList';
import IngredientsList from '../components/IngredientsList';

/* Grocery List Page Component
    This is the main page for the grocery list feature. It allows users to
    select a date range and generate a grocery list based on their food log
    history.
*/
const GroceryListPage = () => {
    // Get all state and functions from the useGroceryList hook
    const {
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        groceryData,
        isLoading,
        error,
        generateGroceryList,
        formatDate,
        exportFoodItems,
        exportIngredients,
        exportCompleteList
    } = useGroceryList();

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-green-50/50">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    {/* Page Header */}
                    <header className="mb-10 bg-gradient-to-r from-[var(--primary-color-teal)] to-[var(--secondary-color-green)] p-6 rounded-2xl text-white shadow-lg">
                        <div className="flex items-center gap-3">
                            <ShoppingCart size={32} className="text-white" />
                            <div>
                                <h1 className="text-3xl font-bold">Grocery List Generator</h1>
                                <p className="text-lg opacity-90">Generate your shopping list based on your meal history</p>
                            </div>
                        </div>
                    </header>

                    {/* Date Range Selection Form */}
                    <DateRangeForm
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        handleGenerate={generateGroceryList}
                        isLoading={isLoading}
                        error={error}
                    />

                    {/* Results Section - show if data is available */}
                    {groceryData && (
                        <div className="space-y-8">
                            {/* Summary Statistics */}
                            <GrocerySummary
                                groceryData={groceryData}
                                formatDate={formatDate}
                                onExportComplete={exportCompleteList}
                            />

                            {/* Food Items Grid */}
                            <FoodItemsList
                                foodItems={groceryData.food_items}
                                onExport={exportFoodItems}
                            />

                            {/* Ingredients List */}
                            <IngredientsList
                                ingredients={groceryData.ingredients}
                                onExport={exportIngredients}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default GroceryListPage; 