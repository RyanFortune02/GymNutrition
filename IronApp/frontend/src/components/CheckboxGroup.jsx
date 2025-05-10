/**
 * CheckboxGroup Component
 * Renders a group of checkboxes for multiple selections using bitwise operations

 */
const CheckboxGroup = ({ options, value = 0, onChange, name, className = '' }) => {
  const handleCheckboxChange = (optionValue) => {
    // Check if the option and the current value are both true
    if (value & optionValue) {
      // If so, remove the option from the value
      onChange({ target: { name, value: value & ~optionValue } });
    } 
    // Otherwise, add it (set the bit)
    else {
      // Update the value with the new option
      onChange({ target: { name, value: value | optionValue } });
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center">
          <input
            type="checkbox"
            id={`${name}-${option.value}`}
            checked={(value & option.value) !== 0}
            onChange={() => handleCheckboxChange(option.value)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label 
            htmlFor={`${name}-${option.value}`} 
            className="ml-2 block text-sm text-gray-700"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxGroup; 