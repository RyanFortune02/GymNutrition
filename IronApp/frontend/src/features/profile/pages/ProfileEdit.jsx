import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useProfile from "../hooks/useProfile";
import { FOOD_PREF_OPTIONS, ALLERGY_OPTIONS, GENDER_OPTIONS, ACTIVITY_LEVEL_OPTIONS } from "../../formConfig";
import LoadingIndicator from "../../../components/LoadingIndicator";

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
    <form className="w-full max-w-md mx-auto p-8 bg-white rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input
        className="w-11/12 p-2.5 my-2.5 border border-gray-300 rounded"
        type="number"
        name="age"
        value={profile.age}
        onChange={handleChange}
        placeholder="Age"
        required
      />
      <select
        className="w-11/12 p-2.5 my-2.5 border border-gray-300 rounded"
        name="sex"
        value={profile.sex}
        onChange={handleChange}
        required
      >
        {GENDER_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <input
        className="w-11/12 p-2.5 my-2.5 border border-gray-300 rounded"
        type="number"
        name="height"
        value={profile.height}
        onChange={handleChange}
        placeholder="Height (cm)"
        required
      />
      <input
        className="w-11/12 p-2.5 my-2.5 border border-gray-300 rounded"
        type="number"
        name="weight"
        value={profile.weight}
        onChange={handleChange}
        placeholder="Weight (kg)"
        required
      />
      <select
        className="w-11/12 p-2.5 my-2.5 border border-gray-300 rounded"
        name="activity_level"
        value={profile.activity_level}
        onChange={handleChange}
        required
      >
        {ACTIVITY_LEVEL_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <select
        className="w-11/12 p-2.5 my-2.5 border border-gray-300 rounded"
        name="food_preferences"
        value={profile.food_preferences}
        onChange={handleChange}
        required
      >
        {FOOD_PREF_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <select
        className="w-11/12 p-2.5 my-2.5 border border-gray-300 rounded"
        name="allergies"
        value={profile.allergies}
        onChange={handleChange}
        required
      >
        {ALLERGY_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <button
        className="w-11/12 p-2.5 my-5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
        type="submit"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

export default ProfileEdit;
