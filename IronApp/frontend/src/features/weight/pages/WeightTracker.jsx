import NavBar from '../../../components/NavBar';
import WeightEntryForm from '../components/WeightEntryForm';
import WeightHistory from '../components/WeightHistory';
import CurrentWeight from '../components/CurrentWeight';
import useWeightTracker from '../hooks/useWeightTracker';
import useProfile from '../../profile/hooks/useProfile';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { Scale } from 'lucide-react';
import { kgToLbs } from '../../../utils/unitConversion';

/**
 * Weight Tracker page displays the user's current weight and recent changes, 
 * and allows them to add and delete weight entries
 * Calls components for the current weight, weight history, and weight entry form
 */
const WeightTracker = () => {
  const {
    weightHistory,
    initialWeight,
    addWeightEntry,
    deleteWeightEntry,
    isSubmitting,
    weightError,
    profileLoading
  } = useWeightTracker();
  
  const { profile } = useProfile();

  // Convert profile weight from kg to lbs for display
  const profileWeightInLbs = profile?.weight ? kgToLbs(profile.weight) : 0;

  if (profileLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Scale size={28} className="text-[var(--secondary-color-green)]" />
            <h1 className="text-3xl font-bold text-[var(--neutral-color-blue)]">Weight Tracker</h1>
          </div>
          <p className="text-gray-500 mt-1">Track your weight progress over time</p>
        </header>

        {/* Current Weight Display  - displays the user's current weight and recent changes */}
        <CurrentWeight 
          weightEntries={weightHistory} 
          profileWeight={profileWeightInLbs}
          initialWeight={initialWeight} 
        />

        {/* Error message - displays if there is an error with the weight entries */}
        {weightError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {weightError}
          </div>
        )}

        {/* Weight Entry Form - allows the user to add a new weight entry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <WeightEntryForm onSubmit={addWeightEntry} isSubmitting={isSubmitting} />
          </div>
          <div>
            {/* Weight History - displays the user's weight history */}
            <WeightHistory 
              weightEntries={weightHistory} 
              onDelete={deleteWeightEntry} 
              initialWeight={initialWeight}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WeightTracker;
