import React from 'react';
import useFoodLog from '../foodlog/hooks/useFoodLog';
import DailySummary from '../foodlog/components/DailySummary';

import NavBar from '../../components/NavBar';
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

                <DailySummary
                    meals={meals}
                    calculateTotalNutrients={calculateTotalNutrients}
                    calculateDailyTotals={calculateDailyTotals}
                />
            </div>
        </>
    );
};

export default DashboardPage;
