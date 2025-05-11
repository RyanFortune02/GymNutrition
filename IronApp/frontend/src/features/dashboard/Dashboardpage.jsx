import React from 'react';
import useFoodLog from '../foodlog/hooks/useFoodLog';
import DailySummary from '../foodlog/components/DailySummary';
import WeightCharts from './components/WeightCharts';

import BMRCalculator from './components/BMRCalculator';
import NavBar from '../../components/NavBar';
import MacroNutrient from './components/MacroNutrient';
/*
Dashboard page for the user to view their daily nutrition overview.
*/

const DashboardPage = () => {
    const { meals, calculateTotalNutrients, calculateDailyTotals } = useFoodLog();

    return (
        <>
            <NavBar/>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--neutral-color-blue)]">Dashboard</h1>
                    <p className="text-gray-500 mt-2">Your daily nutrition overview</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <BMRCalculator />
                    <MacroNutrient />
                </div>
                
                {/* Weight Charts with toggleable views */}
                <div className="mb-8">
                    <WeightCharts />
                </div>
                
                <div>
                    <DailySummary
                        meals={meals}
                        calculateTotalNutrients={calculateTotalNutrients}
                        calculateDailyTotals={calculateDailyTotals}
                    />
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
