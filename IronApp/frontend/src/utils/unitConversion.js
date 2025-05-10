/**
 * Unit conversion utilities
 * Provides functions to convert between metric and imperial units
 * Ensures that the height and weight values are displayed in the correct format (feet/inches and pounds)
 * Used in the profile page, profile edit page, and the form
 */

// Convert cm to feet and inches for the frontend
export function cmToFeetInches(cm) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

// Convert feet and inches to cm for the backend
export function feetInchesToCm(feet, inches) {
  const totalInches = (feet * 12) + inches;
  return Math.round(totalInches * 2.54);
}

// Format height in feet and inches for the frontend
export function formatHeightImperial(cm) {
  const { feet, inches } = cmToFeetInches(cm);
  return `${feet}' ${inches}"`;
}

// Convert kg to lbs for the backend
export function kgToLbs(kg) {
  return Math.round(kg * 2.20462);
}

// Convert lbs to kg for the backend
export function lbsToKg(lbs) {
  return Math.round(lbs / 2.20462);
}

// Format weight in pounds for the frontend
export function formatWeightImperial(kg) {
  return `${kgToLbs(kg)} lbs`;
} 