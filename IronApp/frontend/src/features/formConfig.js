/*
Form config is an array of objects
Each object has a title and an array of fields
*/

// Food preferences options
export const FOOD_PREF_OPTIONS = [
  { label: "Vegetarian", value: 1 },
  { label: "Vegan", value: 2 },
  { label: "Pescatarian", value: 4 },
  { label: "Keto", value: 8 },
  { label: "Paleo", value: 16 },
  { label: "Gluten Free", value: 32 },
  { label: "Dairy Free", value: 64 },
  { label: "Low Carb", value: 128 },
];

// Allergy options 
export const ALLERGY_OPTIONS = [
  { label: "Peanuts", value: 1 },
  { label: "Tree Nuts", value: 2 },
  { label: "Milk", value: 4 },
  { label: "Eggs", value: 8 },
  { label: "Wheat", value: 16 },
  { label: "Soy", value: 32 },
  { label: "Fish", value: 64 },
  { label: "Shellfish", value: 128 },
];

// Gender options
export const GENDER_OPTIONS = [
  { label: "Male", value: "M" },
  { label: "Female", value: "F" },
];

// Activity level options
export const ACTIVITY_LEVEL_OPTIONS = [
  { label: "None", value: 0 },
  { label: "Light", value: 1 },
  { label: "Moderate", value: 2 },
  { label: "High", value: 3 },
  { label: "Very High", value: 4 },
];

/*
Form steps:
1. Account Details
2. Profile
3. Dietary Preferences
4. Review & Submit
*/
export const steps = [
  {
    title: "Account Details",
    fields: [
      { name: "username", label: "Username", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true, validate: (val) => /\S+@\S+\.\S+/.test(val) },
      { name: "password", label: "Password", type: "password", required: true, validate: (val) => val.length >= 6 },
    ],
  },
  {
    title: "Profile",
    fields: [
      { name: "age", label: "Age", type: "number", required: true },
      { name: "sex", label: "Sex", type: "select", required: true, options: GENDER_OPTIONS },
      { name: "height", label: "Height (cm)", type: "number", required: true },
      { name: "weight", label: "Weight (kg)", type: "number", required: true },
      { name: "activity_level", label: "Activity Level", type: "select", required: true, options: ACTIVITY_LEVEL_OPTIONS },
    ],
  },
  {
    title: "Dietary Preferences",
    fields: [
      { name: "food_preferences", label: "Food Preferences", type: "checkboxGroup", options: FOOD_PREF_OPTIONS },
      { name: "allergies", label: "Allergies", type: "checkboxGroup", options: ALLERGY_OPTIONS },
    ],
  },
  {
    title: "Review & Submit",
    review: true,
  },
];
