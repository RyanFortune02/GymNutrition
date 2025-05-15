import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Form from "../components/Form";

import { LogIn, UserPlus } from 'lucide-react';
import landingPagePic from '../../../assets/landingPagePic.jpg';
export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        <div className="hidden md:block md:w-1/2 bg-cover bg-center object-none md:object-cover" style={{ backgroundImage: `url(${landingPagePic})` }}>
        </div>

        {/* Form Panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">

          <div className="text-center mb-8 pt-10 md:pt-0"> 
            <h2 className="text-2xl font-semibold text-gray-700" style={{ color: 'var(--primary-color-teal)'}}>Welcome Back!</h2>
            <p className="text-gray-500 text-sm">Sign in to continue your journey.</p>
          </div>

          <Form 
            route="/api/token/" 
            method="login" 
            buttonText="Sign In"
            buttonIcon={<LogIn size={18} className="mr-2" />}
            onSuccess={() => navigate("/dashboard")}
            onError={setError}
            inputBgColor="bg-gray-100"
            buttonStyle={{ backgroundColor: 'var(--primary-color-teal)'}}
            buttonHoverColor="hover:bg-[var(--secondary-color-green)]"
          />
          {error && (
            <div 
              className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm text-center animate-shake"
            >
              {error}
            </div>
          )}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link 
              to="/register" 
              className="font-medium transition-colors hover:underline flex items-center justify-center mt-1"
              style={{ color: 'var(--accent-color-orange)'}}
            >
              <UserPlus size={16} className="mr-1" />
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
