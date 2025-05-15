import MultiStepForm from "../components/MultiStepForm";
import { Link } from "react-router-dom";
import { LogIn } from 'lucide-react';
import RegisterImage from '../../../assets/registerImage.png';

export default function Register() {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-gray-900 via-[var(--neutral-color-blue)] to-gray-800 p-4">
      {/* Website name positioned at the top-left of the entire page */}
      <div className="absolute top-0 left-0 p-4 sm:p-6 z-10">
        <Link to="/" className="text-3xl font-bold tracking-tight inline-block" style={{ color: 'var(--primary-color-teal)' }}>
          Gym<span style={{ color: 'var(--accent-color-orange)'}}>Nutrition</span>
        </Link>
      </div>

      {/* Main content card */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Image Panel */}
        <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${RegisterImage})` }}>
        </div>

        {/* Form Panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">

          <div className="text-center mb-8 pt-10 md:pt-0"> 
            <h2 className="text-2xl font-semibold text-gray-700">Create Your Account</h2>
            <p className="text-gray-500 text-sm">Join us and start your fitness journey today!</p>
          </div>

          <MultiStepForm 
            route="/api/user/register/" 
            method="register" 
          />
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link 
              to="/login" 
              className="font-medium transition-colors hover:underline flex items-center justify-center mt-1"
              style={{ color: 'var(--accent-color-orange)'}}
            >
              <LogIn size={16} className="mr-1" />
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
