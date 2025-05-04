import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useProfile from "../hooks/useProfile";
import { FOOD_PREF_OPTIONS, ALLERGY_OPTIONS, GENDER_OPTIONS, ACTIVITY_LEVEL_OPTIONS } from "../../formConfig";
import LoadingIndicator from "../../../components/LoadingIndicator";
import NavBar from "../../../components/NavBar";

function ProfileEdit() {
  const { profile, loading, error, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update profile object with new value
    profile[name] = value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profile);
      navigate("/profile"); // Redirect to profile page
    } catch (err) {
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <form className="max-w-md mx-auto my-12 p-8 bg-white rounded-lg shadow-md border border-gray-200" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-[var(--primary-color-teal)]">Edit Profile</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <div className="mb-4">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Age</label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-[var(--primary-color-teal)] focus:border-[var(--primary-color-teal)] focus:outline-none"
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              placeholder="Age"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Sex</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-[var(--primary-color-teal)] focus:border-[var(--primary-color-teal)] focus:outline-none"
              name="sex"
              value={profile.sex}
              onChange={handleChange}
              required
            >
              {GENDER_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Height (cm)</label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-[var(--primary-color-teal)] focus:border-[var(--primary-color-teal)] focus:outline-none"
              type="number"
              name="height"
              value={profile.height}
              onChange={handleChange}
              placeholder="Height (cm)"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Weight (kg)</label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-[var(--primary-color-teal)] focus:border-[var(--primary-color-teal)] focus:outline-none"
              type="number"
              name="weight"
              value={profile.weight}
              onChange={handleChange}
              placeholder="Weight (kg)"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Activity Level</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-[var(--primary-color-teal)] focus:border-[var(--primary-color-teal)] focus:outline-none"
              name="activity_level"
              value={profile.activity_level}
              onChange={handleChange}
              required
            >
              {ACTIVITY_LEVEL_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Food Preferences</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-[var(--primary-color-teal)] focus:border-[var(--primary-color-teal)] focus:outline-none"
              name="food_preferences"
              value={profile.food_preferences}
              onChange={handleChange}
              required
            >
              {FOOD_PREF_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-[var(--neutral-color-blue)] text-sm font-medium mb-2">Allergies</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-[var(--primary-color-teal)] focus:border-[var(--primary-color-teal)] focus:outline-none"
              name="allergies"
              value={profile.allergies}
              onChange={handleChange}
              required
            >
              {ALLERGY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
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
