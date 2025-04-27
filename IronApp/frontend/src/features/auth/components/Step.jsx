import React from "react";
import Field from "./Field";
import { FOOD_PREF_OPTIONS, ALLERGY_OPTIONS, GENDER_OPTIONS, ACTIVITY_LEVEL_OPTIONS } from "../../formConfig";

/*
Step component
It is used to render a single step in the form
The component is used by the MultiStepForm component
*/

export default function Step({ config, formData, setField, inputRef }) {
  if (config.review) {
    // Gets label from value 
    const getLabel = (value, options) => {
      const opt = options.find(o => String(o.value) === String(value));
      return opt ? opt.label : value;
    };
    // Gets labels from bitmask for food and allergy
    const getCheckedLabels = (val, options) => {
      if (Array.isArray(val)) {
        return val.map(v => getLabel(v, options)).join(", ");
      }
      // check if val is a number or string of numbers
      if (typeof val === 'number' || /^[0-9]+$/.test(val)) {
        const intVal = parseInt(val, 10);
        return options.filter(opt => (intVal & opt.value)).map(opt => opt.label).join(", ") || "None";
      }
      return "None";
    };
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">{config.title}</h2>
        {Object.entries(formData).map(([key, val]) => {
          if (key === "password") {
            return (
              <div key={key} className="mb-2">
                <span className="font-semibold capitalize">Password:</span> ******
              </div>
            );
          }
          if (key === "sex") {
            return (
              <div key={key} className="mb-2">
                <span className="font-semibold capitalize">Sex:</span> {getLabel(val, GENDER_OPTIONS)}
              </div>
            );
          }
          if (key === "activity_level") {
            return (
              <div key={key} className="mb-2">
                <span className="font-semibold capitalize">Activity Level:</span> {getLabel(val, ACTIVITY_LEVEL_OPTIONS)}
              </div>
            );
          }
          if (key === "food_preferences") {
            return (
              <div key={key} className="mb-2">
                <span className="font-semibold capitalize">Food Preferences:</span> {getCheckedLabels(val, FOOD_PREF_OPTIONS)}
              </div>
            );
          }
          if (key === "allergies") {
            return (
              <div key={key} className="mb-2">
                <span className="font-semibold capitalize">Allergies:</span> {getCheckedLabels(val, ALLERGY_OPTIONS)}
              </div>
            );
          }
          return (
            <div key={key} className="mb-2">
              <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {val}
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{config.title}</h2>
      {config.fields.map((field, idx) => (
        <Field
          key={field.name}
          config={field}
          value={formData[field.name]}
          onChange={setField}
          inputRef={idx === 0 ? inputRef : null}
        />
      ))}
    </div>
  );
}
