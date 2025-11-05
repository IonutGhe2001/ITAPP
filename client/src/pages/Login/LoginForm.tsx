import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { useAuth } from '@/context/useAuth';
import { ROUTES } from '@/constants/routes';

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
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');

    let hasError = false;
    if (!email) {
      setEmailError(t('login.emailRequired'));
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError(t('login.emailInvalid'));
      hasError = true;
    }

    if (!parola) {
      setPasswordError(t('login.passwordRequired'));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email,
        password: parola,
      });
      const token = res.data?.token;
      if (token) {
        auth.login(token);
      }
      navigate(ROUTES.DASHBOARD);
    } catch {
      setError(t('login.errorInvalid'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="animate-fade-in-down w-full max-w-xs space-y-6"
    >
      {error && <div className="text-center text-sm text-red-600">{error}</div>}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          {t('login.email')}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          placeholder={t('login.emailPlaceholder')}
          autoComplete="email"
          className={`w-full rounded border px-4 py-2 focus:outline-none focus:ring ${emailError ? 'border-red-500' : 'border-gray-300'}`}
        />
        {emailError && <p className="text-sm text-red-600">{emailError}</p>}
      </div>

      <div className="relative space-y-1">
        <label htmlFor="parola" className="text-sm font-medium">
          {t('login.password')}
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
            placeholder={t('login.passwordPlaceholder')}
            autoComplete="current-password"
            inputMode="text"
            className={`w-full rounded border px-4 py-2 focus:outline-none focus:ring ${passwordError ? 'border-red-500' : 'border-gray-300'} pr-12`}
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700"
              aria-label={t('login.togglePassword')}
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
        {loading ? t('login.loading') : t('login.submit')}
      </button>
    </form>
  );
}
