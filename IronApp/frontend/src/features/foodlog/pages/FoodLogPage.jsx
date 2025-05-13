import React, { useState, useEffect } from 'react';
import useFoodLog from '../hooks/useFoodLog';
import SearchForm from '../components/SearchForm';
import ResultsList from '../components/ResultsList';
import MealTab from '../components/MealTab';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Provides the default styles and basic structure for the calendar
import '../components/CalendarStyles.css'; // Custom styles for the calendar
import { Utensils, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CalendarCheck, X } from 'lucide-react';
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
        clearSearchResults: originalClearSearchResults,
        selectedDate,
        goToPreviousDay,
        goToNextDay,
        goToToday,
        goToDate,
        formatDate
    } = useFoodLog();

    const [recentSearches, setRecentSearches] = useState([]);
    const [isRecentLoading, setIsRecentLoading] = useState(false);
    const [recentError, setRecentError] = useState(null);
    const [displayMode, setDisplayMode] = useState('recent');
    const [showCalendar, setShowCalendar] = useState(false);
    
    // Format the date to display the day, month, and year
    const formatDisplayDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    
    // Check if the date is today 
    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

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

    const handleDateChange = (date) => {
        goToDate(date);
        setShowCalendar(false);
    };

    const resultsToShow = displayMode === 'recent' ? recentSearches : searchResults;
    const isLoading = displayMode === 'recent' ? isRecentLoading : isSearchLoading;
    const error = displayMode === 'recent' ? recentError : searchError;
    const showPagination = displayMode === 'search' && totalPages > 1;
    const listTitle = displayMode === 'recent' ? 'Recent Searches' : 'Search Results';
    
    // Check if there are any logged items for the selected date
    const hasLoggedItems = Object.values(meals).some(mealItems => mealItems.length > 0);

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-green-50/50">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <header className="mb-10 bg-gradient-to-r from-[var(--primary-color-teal)] to-[var(--secondary-color-green)] p-6 rounded-2xl text-white shadow-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Utensils size={32} className="text-white" />
                                <div>
                                    <h1 className="text-3xl font-bold">Food Log</h1>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={goToPreviousDay}
                                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                    aria-label="Previous day"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                
                                <button
                                    onClick={() => setShowCalendar(true)}
                                    className="flex items-center gap-2 bg-white/20 py-2 px-4 rounded-lg hover:bg-white/30 transition-colors"
                                >
                                    <CalendarIcon size={20} />
                                    <span>{formatDisplayDate(selectedDate)}</span>
                                </button>
                                
                                <button 
                                    onClick={goToNextDay}
                                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                    aria-label="Next day"
                                >
                                    <ChevronRight size={24} />
                                </button>
                                
                                {!isToday(selectedDate) && (
                                    <button
                                        onClick={goToToday}
                                        className="ml-2 flex items-center gap-1 bg-white/20 py-1 px-3 rounded-lg hover:bg-white/30 transition-colors text-sm"
                                    >
                                        <CalendarCheck size={16} />
                                        Today
                                    </button>
                                )}
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
                                    <h2 className="text-xl font-semibold mb-3 text-gray-700">{listTitle}</h2>
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
                            {!hasLoggedItems && (
                                <div className="bg-white rounded-xl shadow-md p-8 mb-6 border border-gray-100 text-center">
                                    <div className="flex justify-center mb-4">
                                        <CalendarIcon size={48} className="text-gray-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No meals logged for this day</h2>
                                    <p className="text-gray-500 mb-6">
                                        {isToday(selectedDate) 
                                            ? "Start tracking your nutrition by searching for foods and adding them to your meals."
                                            : `You don't have any food items logged for ${formatDisplayDate(selectedDate)}.`
                                        }
                                    </p>
                                    {!isToday(selectedDate) && (
                                        <button
                                            onClick={goToToday}
                                            className="inline-flex items-center gap-2 bg-[var(--primary-color-teal)] text-white py-2 px-4 rounded-lg hover:bg-[var(--primary-color-teal)]/90 transition-colors"
                                        >
                                            <CalendarCheck size={20} />
                                            Return to Today
                                        </button>
                                    )}
                                </div>
                            )}
                            
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

            {showCalendar && (
                <div 
                    className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4"
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                <CalendarIcon size={18} />
                                Select Date
                            </h3>
                            <button 
                                onClick={() => setShowCalendar(false)}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                                aria-label="Close calendar"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        {/* React Calendar to select the date */}
                        <Calendar 
                            onChange={handleDateChange}
                            value={selectedDate}
                            className="custom-calendar"
                        />
                        <div className="calendar-today-button">
                            <button onClick={() => handleDateChange(new Date())}>
                                Go to Today
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FoodLogPage;