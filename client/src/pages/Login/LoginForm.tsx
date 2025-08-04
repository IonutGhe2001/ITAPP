import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '@/context/use-auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setEmailError('');
    setPasswordError('');

    let hasError = false;
    if (!email) {
      setEmailError('Introdu adresa de email');
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Adresa de email nu este validă');
      hasError = true;
    }

    if (!parola) {
      setPasswordError('Introduceți parola');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const res = await api.post('/auth/login', {
        email,
        password: parola,
      });
      const token = res.data?.token;
      if (token) {
        auth.login(token);
      }
      navigate('/');
    } catch {
      setError('Email sau parolă incorectă');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xs space-y-6"
    >
      {error && <div className="text-center text-sm text-red-600">{error}</div>}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          E-Mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          placeholder="exemplu@firma.com"
          autoComplete="email"
          className={`w-full rounded border px-4 py-2 focus:outline-none focus:ring ${emailError ? 'border-red-500' : 'border-gray-300'}`}
        />
        {emailError && <p className="text-sm text-red-600">{emailError}</p>}
      </div>

      <div className="relative space-y-1">
        <label htmlFor="parola" className="text-sm font-medium">
          Parolă
        </label>
        <div className="relative">
          <input
            id="parola"
            type={showPassword ? 'text' : 'password'}
            value={parola}
            onChange={(e) => {
              setParola(e.target.value);
              if (passwordError) setPasswordError('');
            }}
            placeholder="Parolă"
            autoComplete="current-password"
            inputMode="text"
            className={`w-full rounded border px-4 py-2 focus:outline-none focus:ring ${passwordError ? 'border-red-500' : 'border-gray-300'} pr-12`}
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Toggle parola vizibilă"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-red-600 py-2 text-white hover:bg-red-700 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Se autentifică...' : 'Sign In'}
      </button>
    </motion.form>
  );
}
