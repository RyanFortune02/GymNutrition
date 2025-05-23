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
        formatDate
    };
};

export default useGroceryList; 