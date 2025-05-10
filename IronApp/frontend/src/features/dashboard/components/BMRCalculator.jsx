import { useState, useEffect } from 'react';
import useProfile from '../../profile/hooks/useProfile';
import { ACTIVITY_LEVEL_OPTIONS } from '../../formConfig';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { calculateBMR, calculateTDEE } from '../utils/macroUtils';
import useFoodLog from '../../foodlog/hooks/useFoodLog';

/* 
BMR Calculator component that calculates the Basal Metabolic Rate (BMR) and 
Total Daily Energy Expenditure (TDEE) based on the user's profile.
*/
const BMRCalculator = () => {
  const { profile, loading, error } = useProfile();
  const { calculateDailyTotals } = useFoodLog();
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0); 
  
  // Get calories consumed from food log
  const caloriesConsumed = Math.round(calculateDailyTotals()?.calories || 0);
  
  // Calculate remaining calories
  const remainingCalories = tdee - caloriesConsumed;
  
  // Calculate percentage for progress bar
  const caloriesPercentage = Math.min(Math.round((caloriesConsumed / tdee) * 100), 100);

  useEffect(() => {
    if (profile) {
      setBmr(Math.round(calculateBMR(profile)));
      setTdee(Math.round(calculateTDEE(profile)));
    }
  }, [profile]);

  if (loading) {
    return (
      <LoadingIndicator />
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-[color:var(--primary-color-teal)] mb-4">BMR Calculator</h3>
        <p className="text-red-500">Unable to load profile data.</p>
      </div>
    );
  }

  const activityLabel = ACTIVITY_LEVEL_OPTIONS.find(opt => opt.value === profile.activity_level)?.label || 'Unknown';

  return (
    <div className="p-6 bg-gradient-to-b from-[var(--primary-color-blue)] to-[var(--neutral-color-blue)] rounded-xl shadow-lg text-white">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold">Daily Calories Target</h3>
        <p className="text-sm text-white/80 mt-2">Based on {activityLabel} activity level</p>
      </div>
      
      <div className="bg-[var(--primary-color-blue)]/30 p-5 rounded-xl mb-6">
        <div className="text-center mb-6">
          <div className="text-white text-lg mb-1">Daily Target: {tdee} kcal</div>
          <div className="text-white/80 text-sm">Consumed: {caloriesConsumed} kcal</div>
        </div>
        
        <div className="flex justify-center items-end gap-3 mb-2">
          <div className="text-6xl font-bold">{remainingCalories}</div>
          <div className="text-lg font-medium mb-1 text-white/90">KCAL LEFT</div>
        </div>
        
        <div className="mt-5 relative">
          <div className="bg-[var(--primary-color-teal)]/30 h-3 rounded-full w-full"></div>
          <div 
            className="absolute top-0 left-0 bg-[var(--primary-color-teal)] h-3 rounded-full" 
            style={{ width: `${caloriesPercentage}%` }}
          >
          </div>
          <div className="mt-2 text-right text-sm font-medium">{caloriesPercentage}% consumed</div>
        </div>
      </div>
    </div>
  );
};

export default BMRCalculator; 