import React from 'react';
import TrackerForm from '../components/TrackerForm';
import NavBar from '../../../components/NavBar';

const FoodTrackerPage = () => {
    return (
        <>
            <NavBar />
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--neutral-color-blue)]">Future Food Tracking</h1>
                    <p className="text-gray-500 mt-2">Add your meals for specific dates in advance</p>
                </header>
                
                <TrackerForm />
            </div>
        </>
    );
};

export default FoodTrackerPage; 