import { useState } from "react";
import api from "../../auth/api";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingIndicator from "../../../components/LoadingIndicator";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  //Form states
  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        login(res.data.access, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center mx-auto my-12 p-5 max-w-md rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{name}</h1>
      <input
        className="w-11/12 p-2.5 my-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="w-11/12 p-2.5 my-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {loading && <LoadingIndicator />}
      <button 
        className="w-11/12 p-2.5 my-5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
        type="submit"
      >
        {name}
      </button>
    </form>
  );
}

export default Form;
