import React from 'react';
import { Calendar, ShoppingCart, AlertCircle } from 'lucide-react';

/* Date Range Form Component
    This component handles the date range input for grocery list generation.
    Users can select start and end dates, and the form validates input
    before submitting to generate the grocery list.
*/
const DateRangeForm = ({ 
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate, 
    handleGenerate, 
    isLoading, 
    error 
}) => {
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        handleGenerate();
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                <Calendar className="text-[var(--primary-color-teal)]" size={24} />
                Select Date Range
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color-teal)] focus:border-transparent transition-colors"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color-teal)] focus:border-transparent transition-colors"
                            required
                        />
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Submit Button with Loading State */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[var(--primary-color-teal)] text-white py-3 px-6 rounded-lg font-medium hover:bg-[var(--secondary-color-green)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Generating...
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={20} />
                            Generate Grocery List
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default DateRangeForm; 