import React, { useState } from 'react';
import WeightInput from '../../../components/WeightInput';

/**
 * Weight Entry Form component
 * Allows the user to add a new weight entry
 * Calls the onSubmit function to add the new weight entry
 * Displays the form with a date input, weight input, note input and submit button to save the new weight entry
 */
const WeightEntryForm = ({ onSubmit, isSubmitting }) => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [note, setNote] = useState('');

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      weight,
      date,
      note
    });
    // Reset form
    setWeight('');
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-[var(--primary-color-blue)] mb-4">Track Your Weight</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
        <WeightInput 
          value={weight}
          onChange={handleWeightChange}
          name="weight"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-20 "
          placeholder="How are you feeling today?"
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[var(--primary-color-teal)] text-white py-2 px-4 rounded-md hover:bg-[var(--primary-color-blue)] transition-colors duration-200 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Weight Entry'}
      </button>
    </form>
  );
};

export default WeightEntryForm;
