import React, { useState, useEffect } from 'react';

/**
 * HeightInput Component
 * Renders a height input that handles feet and inches 
 */
const HeightInput = ({ value, onChange, name, className = '' }) => {
  const [height, setHeight] = useState({ feet: '', inches: '' }); // Store the height in feet and inches

  // Sync with parent value to ensure the height is displayed correctly
  useEffect(() => {
    if (
      value &&
      (value.feet !== height.feet || value.inches !== height.inches)
    ) {
      setHeight({
        feet: value.feet === undefined ? '' : value.feet,
        inches: value.inches === undefined ? '' : value.inches,
      });
    }
  }, [value]);

  const handleChange = (e) => {
    const { name: field, value: val } = e.target;
    let v = parseInt(val, 10);
    if (isNaN(v)) v = '';
    if (field === 'feet' && v > 9) v = 9; // Max height in feet
    if (field === 'inches' && v > 11) v = 11; // Max height in inches
    const updated = { ...height, [field]: v };
    setHeight(updated);
    onChange({ target: { name, value: updated } });
  };

  return (
    <div className={`flex space-x-4 ${className}`}>
      <div className="w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Feet</label>
        <input
          type="number"
          name="feet"
          value={height.feet}
          onChange={handleChange}
          min="0"
          max="9"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Inches</label>
        <input
          type="number"
          name="inches"
          value={height.inches}
          onChange={handleChange}
          min="0"
          max="11"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default HeightInput; 