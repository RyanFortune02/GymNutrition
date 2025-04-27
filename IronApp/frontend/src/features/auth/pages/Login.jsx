import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Form from "../components/Form";

export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <Form 
          route="/api/token/" 
          method="login" 
          onSuccess={() => navigate("/profile")}
          onError={setError}
        />
        {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
        <div className="mt-4 text-center">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
}
