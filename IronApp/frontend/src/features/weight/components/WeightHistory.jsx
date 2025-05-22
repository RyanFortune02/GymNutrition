import { Trash2, TrendingUp, TrendingDown, Minus, Calendar, Scale, Info } from 'lucide-react';

/*
 * Weight History component displays the user's weight history
 * Displays the user's weight history, initial weight, and recent changes
 * Allows the user to delete a weight entry
 */
const WeightHistory = ({ weightEntries, onDelete, initialWeight }) => {
  // Format date consistently with timezone handling
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    
    // Create a date object from the ISO string
    const date = new Date(dateString + 'T12:00:00'); // Use noon to avoid timezone boundary issues
    return date.toLocaleDateString();
  };

  // If there are no weight entries, display a message
  if (!weightEntries || weightEntries.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
        <Scale className="mx-auto mb-3 text-gray-400" size={24} />
        <p>No weight entries yet. Start tracking your progress!</p>
      </div>
    );
  }
  
  // Calculate weight change between entries
  const getWeightChange = (currentIndex) => {
    if (currentIndex === weightEntries.length - 1) {
      return null; // This is the oldest entry, no previous to compare with
    }
    
    // Get the current and previous weight entries
    const currentWeight = weightEntries[currentIndex].weight;
    const previousWeight = weightEntries[currentIndex + 1].weight;
    
    // Current weight minus previous weight shows the change
    // Positive value means weight gain, negative means weight loss
    const difference = currentWeight - previousWeight;
    
    return {
      amount: difference,
      isGain: difference > 0,
      isEqual: difference === 0
    };
  };

  // Calculate change from initial weight
  const getChangeFromInitial = (weight) => {
    if (!initialWeight) return null;
    
    const difference = weight - initialWeight;
    
    return {
      amount: difference,
      isGain: difference > 0,
      isEqual: difference === 0,
      percentage: ((difference / initialWeight) * 100).toFixed(1)
    };
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-xl font-semibold text-[var(--primary-color-blue)] p-4 border-b flex items-center">
        <Scale size={20} className="mr-2 text-[var(--secondary-color-green)]" />
        Weight History
      </h2>
      
      {/* Display the user's starting weight */}
      {initialWeight && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b">
          <div className="flex items-center">
            <Info size={16} className="text-purple-500 mr-2" />
            <p className="text-sm text-gray-700">
              Starting Weight: <span className="font-bold text-[var(--primary-color-blue)]">{initialWeight} lbs</span>
            </p>
          </div>
        </div>
      )}
      
      {/* Display the user's weight history */}
      <ul className="divide-y divide-gray-200">
        {weightEntries.map((entry, index) => {
          const weightChange = getWeightChange(index);
          const changeFromInitial = getChangeFromInitial(entry.weight);
          
          return (
            <li key={entry.date || index} className="transition-colors hover:bg-gray-50">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Date and badges row */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <div className="flex items-center text-gray-700">
                        <Calendar size={14} className="mr-1 text-gray-500" />
                        <p className="font-medium">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex flex-wrap gap-1">
                        {index === 0 && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            Current
                          </span>
                        )}
                        {entry.isInitial && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                            Initial
                          </span>
                        )}
                        {weightChange && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full 
                            ${weightChange.isGain 
                              ? 'bg-green-100 text-green-800' 
                              : weightChange.isEqual 
                                ? 'bg-gray-100 text-gray-800' 
                                : 'bg-red-100 text-red-800'}`}>
                            {weightChange.isEqual 
                              ? 'No change' 
                              : (weightChange.isGain ? '+' : '') + Math.abs(weightChange.amount).toFixed(1) + ' lbs'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Weight display */}
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-[var(--primary-color-teal)]">
                        {entry.weight} <span className="text-lg font-medium text-gray-500">lbs</span>
                      </p>
                      {weightChange && (
                        <div className={`flex items-center ${
                          weightChange.isEqual ? 'text-gray-400' :
                          weightChange.isGain ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {weightChange.isEqual ? (
                            <Minus size={16} className="ml-1" />
                          ) : weightChange.isGain ? (
                            <TrendingUp size={16} className="ml-1" />
                          ) : (
                            <TrendingDown size={16} className="ml-1" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Change from initial weight */}
                    {changeFromInitial && !entry.isInitial && (
                      <div className="mt-1 text-sm text-gray-600 flex items-center">
                        <span className="mr-1">From starting:</span>
                        <span className={`font-medium ${
                          changeFromInitial.isEqual ? 'text-gray-600' :
                          changeFromInitial.isGain ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {changeFromInitial.isEqual 
                            ? 'No change' 
                            : `${changeFromInitial.isGain ? '+' : ''}${Math.abs(changeFromInitial.amount).toFixed(1)} lbs (${changeFromInitial.isGain ? '+' : ''}${changeFromInitial.percentage}%)`}
                        </span>
                      </div>
                    )}
                    
                    {/* Note */}
                    {entry.note && (
                      <p className="text-gray-600 mt-2 text-sm bg-gray-50 p-2 rounded border border-gray-100">
                        {entry.note}
                      </p>
                    )}
                  </div>
                  
                  {/* Delete button */}
                  <button
                    onClick={() => onDelete(entry.date)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition-colors ml-2 flex-shrink-0"
                    aria-label="Delete entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WeightHistory;
