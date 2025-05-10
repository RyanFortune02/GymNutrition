import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProfile from "../hooks/useProfile";
import { FOOD_PREF_OPTIONS, ALLERGY_OPTIONS, GENDER_OPTIONS, ACTIVITY_LEVEL_OPTIONS } from "../../formConfig";
import LoadingIndicator from "../../../components/LoadingIndicator";
import NavBar from "../../../components/NavBar";
import CheckboxGroup from "../../../components/CheckboxGroup";
import HeightInput from "../../../components/HeightInput";
import WeightInput from "../../../components/WeightInput";
import { cmToFeetInches, feetInchesToCm, kgToLbs, lbsToKg } from "../../../utils/unitConversion";

function ProfileEdit() {
  const { profile, loading, error, updateProfile } = useProfile();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Get the profile data and convert cm/kg to feet/inches and pounds
  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        height: cmToFeetInches(profile.height),
        weight: kgToLbs(profile.weight),
      });
    }
  }, [profile]);

  // Handle changes to formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // On submit, convert imperial to metric for backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        height: feetInchesToCm(formData.height.feet, formData.height.inches),
        weight: lbsToKg(formData.weight),
      };
      await updateProfile(payload); // Update the profile with the new form data
      navigate("/profile"); // Redirect to profile page
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <form className="max-w-xl mx-auto my-12 p-8 bg-white rounded-lg shadow-md border border-gray-200" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-[var(--primary-color-teal)]">Edit Profile</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <div className="mb-6">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Age</label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-[var(--primary-color-teal)] focus:border-[var(--primary-color-teal)] focus:outline-none"
              type="number"
              name="age"
              value={formData.age || ""}
              onChange={handleChange}
              placeholder="Age"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Sex</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-[var(--primary-color-teal)] focus:border-[var(--primary-color-teal)] focus:outline-none"
              name="sex"
              value={formData.sex || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select sex</option>
              {GENDER_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Height</label>
            <HeightInput 
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Weight</label>
            <WeightInput
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Activity Level</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-[var(--primary-color-teal)] focus:border-[var(--primary-color-teal)] focus:outline-none"
              name="activity_level"
              value={formData.activity_level || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select activity level</option>
              {ACTIVITY_LEVEL_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Food Preferences</label>
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <CheckboxGroup
                name="food_preferences"
                options={FOOD_PREF_OPTIONS}
                value={formData.food_preferences || 0}
                onChange={handleChange}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Select all that apply</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Allergies</label>
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <CheckboxGroup
                name="allergies"
                options={ALLERGY_OPTIONS}
                value={formData.allergies || 0}
                onChange={handleChange}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Select all that apply</p>
          </div>
          
          <button
            className="w-full p-3 my-4 bg-gradient-to-r from-[var(--primary-color-teal)] to-[var(--secondary-color-green)] text-white rounded hover:opacity-90 transition-opacity duration-200 font-medium"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
}

export default ProfileEdit;
