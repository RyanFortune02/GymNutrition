import MultiStepForm from "../components/MultiStepForm";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-2">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl p-4 sm:p-8 bg-white rounded-lg shadow-lg mx-auto transition-all duration-300 border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[color:var(--primary-color-teal)]">Register</h2>
        <MultiStepForm route="/api/user/register/" method="register" />
        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}
