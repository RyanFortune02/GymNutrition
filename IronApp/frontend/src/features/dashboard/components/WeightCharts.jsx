import React, { useState } from 'react';
import WeightChart from './MonthlyWeightChart';
import WeeklyWeightChart from './WeeklyWeightChart';
import {CalendarDays, CalendarRange } from 'lucide-react';

/**
 * WeightCharts - Container component that lets users switch between weekly and monthly views of weight charts
 */
const WeightCharts = () => {
  // State to track which view is active
  const [activeView, setActiveView] = useState('weekly'); // Default to weekly view
  
  // Function to toggle between views
  const toggleView = (view) => {
    setActiveView(view);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--neutral-color-blue)]">
          Weight Tracking
        </h2>
        
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => toggleView('weekly')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'weekly' 
                ? 'bg-white text-[var(--primary-color-blue)] shadow-sm' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="Show weekly view"
          >
            <CalendarRange size={16} />
            <span className="hidden sm:inline">Weekly</span>
          </button>
          
          <button
            onClick={() => toggleView('monthly')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'monthly' 
                ? 'bg-white text-[var(--primary-color-blue)] shadow-sm' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="Show monthly view"
          >
            <CalendarDays size={16} />
            <span className="hidden sm:inline">Monthly</span>
          </button>
        </div>
      </div>
      
      {/* Render the appropriate chart based on activeView */}
      <div className="transition-opacity duration-300">
        {activeView === 'weekly' ? (
          <div className="animate-fadeIn">
            <WeeklyWeightChart />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <WeightChart />
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightCharts; 