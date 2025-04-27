import useProfile from "../hooks/useProfile";
import useAuth from "../../auth/hooks/useAuth";
import { FOOD_PREF_OPTIONS, ALLERGY_OPTIONS, GENDER_OPTIONS, ACTIVITY_LEVEL_OPTIONS } from "../../formConfig";
import LoadingIndicator from "../../../components/LoadingIndicator";

function Profile() {
  const { profile, loading, error } = useProfile();
  const { logout } = useAuth();

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;
  if (!profile) return null;

  const genderLabel = GENDER_OPTIONS.find(opt => opt.value === profile.sex)?.label || profile.sex;
  const activityLabel = ACTIVITY_LEVEL_OPTIONS.find(opt => opt.value === profile.activity_level)?.label || profile.activity_level;

  // Bitwise decode food preferences and allergies 
  const getCheckedLabels = (val, options) =>
    options.filter(opt => (val & opt.value)).map(opt => opt.label).join(", ") || "None";

  return (
    <div className="max-w-lg mx-auto my-12 p-8 rounded-lg shadow-md bg-white border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-[color:var(--primary-color-teal)]">My Profile</h1>
      <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Age:</span> {profile.age}</div>
      <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Sex:</span> {genderLabel}</div>
      <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Height:</span> {profile.height} cm</div>
      <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Weight:</span> {profile.weight} kg</div>
      <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Activity Level:</span> {activityLabel}</div>
      <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Food Preferences:</span> {getCheckedLabels(profile.food_preferences, FOOD_PREF_OPTIONS)}</div>
      <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Allergies:</span> {getCheckedLabels(profile.allergies, ALLERGY_OPTIONS)}</div>
      <button
        className="w-full mt-6 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-200"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
