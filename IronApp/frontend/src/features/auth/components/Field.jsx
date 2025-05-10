/*
Field component
It is used to render a single field in the form
The component is used by the Step component
*/
import HeightInput from "../../../components/HeightInput";
import WeightInput from "../../../components/WeightInput";
import CheckboxGroup from "../../../components/CheckboxGroup";

export default function Field({ config, value, onChange, inputRef, review }) {
  const { type, name, label, required, options } = config;
  const handle = (val) => onChange(name, val);

  if (name === "height") {
    if (review) {
      // Format for review step to display the height in feet and inches
      const v = value || { feet: '', inches: '' };
      return (
        <div className="mb-4">
          <span className="font-semibold">{label}:</span> {v.feet}' {v.inches}"
        </div>
      );
    }
    return (
      <div className="mb-4">
        <label className="block mb-1">{label}{required && " *"}</label>
        <HeightInput
          name={name}
          value={value || { feet: '', inches: '' }}
          onChange={(e) => handle(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">Maximum height: 9' 10"</p>
      </div>
    );
  }

  if (name === "weight") {
    if (review) {
      // Format for review step to display the weight in pounds
      return (
        <div className="mb-4">
          <span className="font-semibold">{label}:</span> {value} lbs
        </div>
      );
    }
    return (
      <div className="mb-4">
        <label className="block mb-1">{label}{required && " *"}</label>
        <WeightInput
          name={name}
          value={value || ''}
          onChange={(e) => handle(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">Maximum weight: 1,102 lbs</p>
      </div>
    );
  }

  switch (type) {
    case "text":
    case "email":
    case "number":
    case "password":
      return (
        <div className="mb-4">
          <label className="block mb-1">{label}{required && " *"}</label>
          <input
            ref={inputRef}
            type={type}
            value={value || ""}
            onChange={(e) => handle(e.target.value)}
            className="w-full p-2 border rounded"
            required={required}
          />
        </div>
      );

    case "select":
      return (
        <div className="mb-4">
          <label className="block mb-1">{label}{required && " *"}</label>
          <select
            ref={inputRef}
            value={value || ""}
            onChange={(e) => handle(e.target.value)}
            className="w-full p-2 border rounded"
            required={required}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );

    case "checkboxGroup":
      return (
        <div className="mb-4">
          <label className="block mb-1">{label}</label>
          <CheckboxGroup
            name={name}
            options={options}
            value={value || 0}
            onChange={(e) => handle(e.target.value)}
            className="mt-1"
          />
        </div>
      );

    default:
      return null;
  }
}
