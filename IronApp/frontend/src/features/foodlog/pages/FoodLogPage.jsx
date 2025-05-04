import React from 'react';
import useFoodLog from '../hooks/useFoodLog';
import SearchForm from '../components/SearchForm';
import ResultsList from '../components/ResultsList';
import MealTab from '../components/MealTab';
import { Utensils, Calendar } from 'lucide-react';
import NavBar from '../../../components/NavBar';

const FoodLogPage = () => {
    const {
        meals,
        searchInput,
        setSearchInput,
        searchResults,
        searchQuery,
        selectedMeal,
        setMealType,
        handleSearch,
        handleAddFood,
        handleRemoveFood,
        calculateTotalNutrients,
        calculateDailyTotals,
        isLoading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
        searchMode, 
        setSearchMode,
        clearSearchResults
    } = useFoodLog();

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-green-50/50">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <header className="mb-10 bg-gradient-to-r from-[var(--primary-color-teal)] to-[var(--secondary-color-green)] p-6 rounded-2xl text-white shadow-lg">
                        <div className="flex items-center gap-3">
                            <Utensils size={32} className="text-white" />
                            <div>
                                <h1 className="text-3xl font-bold">Food Log</h1>
                                <div className="flex items-center gap-2 mt-2 text-white/80">
                                    <Calendar size={16} />
                                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Food Log Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        {/* Search Section */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-4 z-10">
                                <SearchForm 
                                    searchInput={searchInput}
                                    setSearchInput={setSearchInput}
                                    searchMode={searchMode}
                                    setSearchMode={setSearchMode}
                                    handleSearch={handleSearch}
                                    selectedMeal={selectedMeal}
                                    setMealType={setMealType}
                                    isLoading={isLoading}
                                />
                                
                                {/* Results List */}
                                <div className="mt-6">
                                    <ResultsList 
                                        searchResults={searchResults}
                                        isLoading={isLoading}
                                        error={error}
                                        handleAddFood={handleAddFood}
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        searchInput={searchQuery}
                                        onClearResults={clearSearchResults}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Current Meal Logged Items */}
                        <div className="lg:col-span-2">
                            <MealTab 
                                mealType={selectedMeal}
                                mealItems={meals[selectedMeal]}
                                handleRemoveFood={handleRemoveFood}
                                calculateTotalNutrients={calculateTotalNutrients}
                            />
                        </div>
                    </div>
                    
                    <footer className="mt-16 text-center text-gray-500 text-sm pb-8">
                        <p>Track your nutrition journey with GymNutrition © {new Date().getFullYear()}</p>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default FoodLogPage;
 