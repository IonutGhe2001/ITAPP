import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password: parola,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/"); // redirect la dashboard
    } catch (err) {
      setError("Email sau parolă incorectă");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded"
        required
      />

      <input
        type="password"
        placeholder="Parolă"
        value={parola}
        onChange={(e) => setParola(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700"
      >
        Sign In
      </button>
    </form>
  );
}
