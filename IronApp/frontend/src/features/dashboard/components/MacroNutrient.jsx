import useProfile from '../../profile/hooks/useProfile';
import useFoodLog from '../../foodlog/hooks/useFoodLog';
import { calculateMacroGoals } from '../utils/macroUtils';
import { Beef, Wheat, Droplets } from 'lucide-react';

const MacroNutrient = () => {
  const { profile } = useProfile();
  const { calculateDailyTotals } = useFoodLog();

  // Get macro goals based on profile
  const macroGoals = calculateMacroGoals(profile);

  // Calculate current intake from meals
  const dailyTotals = calculateDailyTotals();
  const currentMacros = {
    protein: dailyTotals?.protein || 0,
    fat: dailyTotals?.fat || 0,
    carbs: dailyTotals?.carbs || 0,
  };
  
  // Calculate percentages for the summary
  const proteinPercentage = macroGoals.protein > 0 
    ? Math.min(Math.round((currentMacros.protein / macroGoals.protein) * 100), 100) 
    : 0;
  
  const carbsPercentage = macroGoals.carbs > 0 
    ? Math.min(Math.round((currentMacros.carbs / macroGoals.carbs) * 100), 100) 
    : 0;
  
  const fatPercentage = macroGoals.fat > 0 
    ? Math.min(Math.round((currentMacros.fat / macroGoals.fat) * 100), 100) 
    : 0;

  return (
    <div className="p-6 bg-gradient-to-b from-[var(--secondary-color-green)] to-[var(--primary-color-teal)] rounded-xl shadow-lg text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Macronutrient Goals</h3>
      </div>
      
      <div className="space-y-5">
        {/* Protein */}
        <div className="bg-[var(--secondary-color-green)]/30 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Beef size={18} className="text-white" />
            <h4 className="font-medium">Protein</h4>
          </div>
          
          <div className="flex justify-between items-center mb-1">
            <span>{Math.round(currentMacros.protein)}g / {macroGoals.protein}g</span>
            <span className="text-white/80">{proteinPercentage}%</span>
          </div>
          
          <div className="w-full bg-white/20 h-2 rounded-full">
            <div 
              className="bg-white h-2 rounded-full" 
              style={{ width: `${proteinPercentage}%` }}
            ></div>
          </div>
        
        </div>
        
        {/* Carbs */}
        <div className="bg-[var(--secondary-color-green)]/30 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Wheat size={18} className="text-white" />
            <h4 className="font-medium">Carbohydrates</h4>
          </div>
          
          <div className="flex justify-between items-center mb-1">
            <span>{Math.round(currentMacros.carbs)}g / {macroGoals.carbs}g</span>
            <span className="text-white/80">{carbsPercentage}%</span>
          </div>
          
          <div className="w-full bg-white/20 h-2 rounded-full">
            <div 
              className="bg-[var(--accent-color-orange)] h-2 rounded-full" 
              style={{ width: `${carbsPercentage}%` }}
            ></div>
          </div>
          
        </div>
        
        {/* Fat */}
        <div className="bg-[var(--secondary-color-green)]/30 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Droplets size={18} className="text-white" />
            <h4 className="font-medium">Fat</h4>
          </div>
          
          <div className="flex justify-between items-center mb-1">
            <span>{Math.round(currentMacros.fat)}g / {macroGoals.fat}g</span>
            <span className="text-white/80">{fatPercentage}%</span>
          </div>
          
          <div className="w-full bg-white/20 h-2 rounded-full">
            <div 
              className="bg-white/80 h-2 rounded-full" 
              style={{ width: `${fatPercentage}%` }}
            ></div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MacroNutrient; 