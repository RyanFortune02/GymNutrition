import React, { useState, useEffect } from 'react';

/**
 * WeightInput Component
 * Renders a weight input that handles pounds only (frontend is imperial)
 * Calls onChange(pounds)
 */
const WeightInput = ({ value, onChange, name, className = '' }) => {
  const [pounds, setPounds] = useState(''); // State to store the weight in pounds

  // Sync with parent value to ensure the weight is displayed correctly
  useEffect(() => {
    if (value !== pounds) {
      setPounds(value === undefined ? '' : value);
    }
  }, [value]);

  const handleChange = (e) => {
    let v = parseInt(e.target.value, 10);
    if (isNaN(v)) v = '';
    if (v > 1102) v = 1102; // 500kg in lbs (max weight) 
    setPounds(v);
    onChange({ target: { name, value: v } });
  };

  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="number"
        value={pounds}
        onChange={handleChange}
        min="0"
        max="1102"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      <span className="ml-2 text-gray-500">lbs</span>
    </div>
  );
};

export default WeightInput; 