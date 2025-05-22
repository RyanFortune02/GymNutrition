import { Scale, ArrowUp, ArrowDown, Calendar } from 'lucide-react';

/**
 * Component to display the user's current weight and recent changes at the top of the weight tracker page
 */
const CurrentWeight = ({ weightEntries = [], profileWeight = 0, initialWeight = 0 }) => {
  // Get current weight (most recent entry or profile weight)
  const getCurrentWeight = () => {
    if (weightEntries && weightEntries.length > 0) {
      // Return the most recent entry (already sorted in useWeightTracker)
      return weightEntries[0].weight;
    }
    // Fallback to profile weight
    return profileWeight;
  };

  // Calculate weight change from previous entry
  const getWeightChange = () => {
    if (!weightEntries || weightEntries.length < 2) return null;
    
    // Get the current and previous weight entries
    const currentWeight = weightEntries[0].weight;
    const previousWeight = weightEntries[1].weight;
    
    // Calculate the difference - positive means gain, negative means loss
    const difference = currentWeight - previousWeight;
    
    return {
      amount: difference, 
      isGain: difference > 0,
      percentage: ((difference / previousWeight) * 100).toFixed(1)
    };
  };

  // Calculate change from initial weight
  const getChangeFromInitial = () => {
    if (!initialWeight) return null;
    
    const currentWeight = getCurrentWeight();
    if (!currentWeight) return null;
    
    const difference = currentWeight - initialWeight;
    
    return {
      amount: difference,
      isGain: difference > 0,
      percentage: ((difference / initialWeight) * 100).toFixed(1)
    };
  };

  const currentWeight = getCurrentWeight();
  const weightChange = getWeightChange();
  const changeFromInitial = getChangeFromInitial();

  // Format date to show in local timezone
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Create a date object 
    const date = new Date(dateString + 'T12:00:00'); // Use noon to avoid timezone issues
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gradient-to-r from-[var(--primary-color-blue)] to-[var(--neutral-color-blue)] p-6 rounded-xl shadow-lg text-white mb-6">
      <div className="flex items-center mb-3">
        <Scale size={22} className="mr-2" />
        <h2 className="text-xl font-semibold">Current Weight</h2>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-3">
          <div className="text-5xl font-bold">{currentWeight}</div>
          <div className="text-xl mb-1 text-white/80">lbs</div>
        </div>
        
        {/* Weight change tag to show recent changes */}
        {weightChange && (
          <div className={`flex items-center ${weightChange.isGain ? 'text-red-300' : 'text-green-300'} bg-white/10 px-3 py-1.5 rounded-lg`}>
            {weightChange.isGain ? 
              <ArrowUp size={18} className="mr-1" /> : 
              <ArrowDown size={18} className="mr-1" />
            }
            <span className="font-medium">
              {Math.abs(weightChange.amount).toFixed(1)} lbs
              <span className="text-xs ml-1 opacity-80">
                ({weightChange.isGain ? '+' : ''}{weightChange.percentage}%)
              </span>
            </span>
          </div>
        )}
      </div>
      
      {/* Change from initial weight tag to show progress from starting weight */}
      {changeFromInitial && initialWeight > 0 && (
        <div className="mt-4 text-sm bg-white/10 p-3 rounded-lg flex flex-col">
          <span className="text-white/80 mb-1">Progress from starting weight:</span>
          <div className="flex items-center">
            <span className={`font-medium ${changeFromInitial.isGain ? 'text-red-300' : 'text-green-300'} flex items-center`}>
              {changeFromInitial.isGain ? 
                <ArrowUp size={14} className="mr-1" /> : 
                <ArrowDown size={14} className="mr-1" />
              }
              {Math.abs(changeFromInitial.amount).toFixed(1)} lbs 
              <span className="ml-1 opacity-80">
                ({changeFromInitial.isGain ? '+' : ''}{changeFromInitial.percentage}%)
              </span>
            </span>
          </div>
        </div>
      )}
      
      {/* Show last updated date */}
      {weightEntries.length > 0 && (
        <div className="text-white/70 text-sm mt-3 flex items-center">
          <Calendar size={14} className="mr-1 text-white/50" />
          Last updated: {formatDate(weightEntries[0].date)}
        </div>
      )}
    </div>
  );
};

export default CurrentWeight; 