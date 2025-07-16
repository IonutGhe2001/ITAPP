import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../services/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password: parola,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      setError("Email sau parolă incorectă");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-6">
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">E-Mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemplu@firma.com"
          autoComplete="email"
          className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${error ? "border-red-500" : "border-gray-300"}`}
          required
        />
      </div>

      <div className="space-y-1 relative">
        <label htmlFor="parola" className="text-sm font-medium">Parolă</label>
        <div className="relative">
          <input
            id="parola"
            type={showPassword ? "text" : "password"}
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            placeholder="Parolă"
            autoComplete="new-password"
            inputMode="text"
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${error ? "border-red-500" : "border-gray-300"} pr-12`}
            required
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Toggle parola vizibilă"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Se autentifică..." : "Sign In"}
      </button>
    </form>
  );
}