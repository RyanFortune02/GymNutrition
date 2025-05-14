import useProfile from "../hooks/useProfile";
import { FOOD_PREF_OPTIONS, ALLERGY_OPTIONS, GENDER_OPTIONS, ACTIVITY_LEVEL_OPTIONS } from "../../formConfig";
import LoadingIndicator from "../../../components/LoadingIndicator";
import NavBar from "../../../components/NavBar";
import { formatHeightImperial, formatWeightImperial } from "../../../utils/unitConversion";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { profile, loading, error } = useProfile();
  const navigate = useNavigate();

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;
  if (!profile) return null;

  const genderLabel = GENDER_OPTIONS.find(opt => opt.value === profile.sex)?.label || profile.sex;
  const activityLabel = ACTIVITY_LEVEL_OPTIONS.find(opt => opt.value === profile.activity_level)?.label || profile.activity_level;

  // Bitwise decode food preferences and allergies 
  const getCheckedLabels = (val, options) =>
    options.filter(opt => (val & opt.value)).map(opt => opt.label).join(", ") || "None";

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto my-12 p-8 rounded-lg shadow-md bg-white border border-gray-200">
          <h1 className="text-2xl font-bold mb-6 text-[color:var(--primary-color-teal)]">My Profile</h1>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Age:</span> {profile.age}</div>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Sex:</span> {genderLabel}</div>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Height:</span> {formatHeightImperial(profile.height)}</div>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Weight:</span> {formatWeightImperial(profile.weight)}</div>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Activity Level:</span> {activityLabel}</div>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Food Preferences:</span> {getCheckedLabels(profile.food_preferences, FOOD_PREF_OPTIONS)}</div>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Allergies:</span> {getCheckedLabels(profile.allergies, ALLERGY_OPTIONS)}</div>
          <button
            onClick={() => navigate("/profile-edit")}
            className="w-full p-3 my-4 bg-gradient-to-r from-[var(--primary-color-teal)] to-[var(--secondary-color-green)] text-white rounded hover:opacity-90 transition-opacity duration-200 font-medium"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/change-password")}
            className="w-full p-3 my-4 bg-[var(--primary-color-blue)] text-white rounded hover:opacity-90 transition-opacity duration-200 font-medium"
          >
            Change Password
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;
