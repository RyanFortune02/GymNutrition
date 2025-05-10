// Macro and BMR/TDEE calculation utilities for the dashboard

// Harris-Benedict multipliers
const activityMultipliers = {
  0: 1.2,    // None (sedentary)
  1: 1.375,  // Light
  2: 1.55,   // Moderate
  3: 1.725,  // High
  4: 1.9,    // Very High
};

// Calculate BMR using Mifflin-St Jeor Equation
export function calculateBMR(profile) {
  if (!profile) return 0;
  const { sex, weight, height, age } = profile;
  if (sex === 'M') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
}

// Calculate TDEE
export function calculateTDEE(profile) {
  if (!profile) return 0;
  const bmr = calculateBMR(profile);
  const multiplier = activityMultipliers[profile.activity_level] || 1.2;
  return Math.round(bmr * multiplier);
}

// Calculate macro goals (grams) based on profile and TDEE
export function calculateMacroGoals(profile) {
  if (!profile) return { protein: 0, fat: 0, carbs: 0 };
  const weightKg = profile.weight;
  const tdee = calculateTDEE(profile);
  let proteinPerKg, fatPerKg;
  if (profile.sex === 'M') {
    proteinPerKg = 2.0;
    fatPerKg = 0.9;
  } else {
    proteinPerKg = 1.6;
    fatPerKg = 0.8;
  }
  const protein = Math.round(weightKg * proteinPerKg);
  const fat = Math.round(weightKg * fatPerKg);
  const proteinCals = protein * 4;
  const fatCals = fat * 9;
  const remainingCals = tdee - (proteinCals + fatCals);
  const carbs = Math.max(Math.round(remainingCals / 4), 0);
  return { protein, fat, carbs };
} 