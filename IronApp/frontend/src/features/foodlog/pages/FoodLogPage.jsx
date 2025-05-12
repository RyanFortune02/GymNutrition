import React, { useState, useEffect } from 'react';
import useFoodLog from '../hooks/useFoodLog';
import SearchForm from '../components/SearchForm';
import ResultsList from '../components/ResultsList';
import MealTab from '../components/MealTab';
import { Utensils, Calendar } from 'lucide-react';
import NavBar from '../../../components/NavBar';
import api from '../../auth/api';

const FoodLogPage = () => {
    const {
        meals,
        searchInput,
        setSearchInput,
        searchResults,
        searchQuery,
        selectedMeal,
        setMealType,
        handleSearch: originalHandleSearch,
        handleAddFood: originalHandleAddFood,
        handleRemoveFood,
        calculateTotalNutrients,
        isLoading: isSearchLoading,
        error: searchError,
        currentPage,
        totalPages,
        handlePageChange,
        searchMode,
        setSearchMode,
        clearSearchResults: originalClearSearchResults
    } = useFoodLog();

    const [recentSearches, setRecentSearches] = useState([]);
    const [isRecentLoading, setIsRecentLoading] = useState(false);
    const [recentError, setRecentError] = useState(null);
    const [displayMode, setDisplayMode] = useState('recent');

    useEffect(() => {
        if (displayMode === 'recent') {
            const fetchRecentItems = async () => {
                setIsRecentLoading(true);
                setRecentError(null);
                try {
                    const response = await api.get('/food/recent/');
                    setRecentSearches(response.data || []);
                } catch (err) {
                    console.error("Failed to fetch recent searches:", err);
                    setRecentError('Failed to load recent searches.');
                } finally {
                    setIsRecentLoading(false);
                }
            };
            fetchRecentItems();
        }
    }, [displayMode]);

    const handleSearch = (e) => {
        if (e && typeof e.preventDefault === 'function') {
          e.preventDefault();
        }
        setDisplayMode('search');
        originalHandleSearch(); 
    };

    const clearSearchResults = () => {
        originalClearSearchResults();
        setDisplayMode('recent'); 
    };

    const handleSelectFood = async (foodItem) => {
        originalHandleAddFood(foodItem, selectedMeal);

        if (displayMode === 'search' && foodItem && foodItem.id) {
            try {
                await api.post('/food/recent/', { food_product_id: foodItem.id });
            } catch (postError) {
                console.error("Failed to add food to recent searches:", postError);
            }
        }
    };

    const resultsToShow = displayMode === 'recent' ? recentSearches : searchResults;
    const isLoading = displayMode === 'recent' ? isRecentLoading : isSearchLoading;
    const error = displayMode === 'recent' ? recentError : searchError;
    const showPagination = displayMode === 'search' && totalPages > 1;
    const listTitle = displayMode === 'recent' ? 'Recent Searches' : 'Search Results';

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
                                    isLoading={isSearchLoading} 
                                />
                                
                                {/* Results List Area */}
                                <div className="mt-6">
                                     {/* add title */}
                                     <h2 className="text-xl font-semibold mb-3 text-gray-700">{listTitle}</h2>
                                     {/* use conditional data/state */}
                                    <ResultsList 
                                        searchResults={resultsToShow}
                                        isLoading={isLoading}
                                        error={error}
                                        handleAddFood={handleSelectFood} 
                                        onClearResults={clearSearchResults} 
                                        searchInput={displayMode === 'search' ? searchQuery : ''}
                                        currentPage={showPagination ? currentPage : 1}
                                        totalPages={showPagination ? totalPages : 1}
                                        onPageChange={showPagination ? handlePageChange : () => {}}
                                        showPagination={showPagination} 
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
                        <p>Track your nutrition journey with GymNutrition {new Date().getFullYear()}</p>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default FoodLogPage;