import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!email.trim() || !password.trim()) {
      setFormError('Please enter your email and password.');
      return;
    }
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(to right, #7c3aed 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-gray-900 border border-gray-700/60 rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
              <Zap size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-100 tracking-tight">GameXPay</h1>
            <p className="text-sm text-gray-500 mt-1">Admin Portal — Sign in to continue</p>
          </div>

          {/* Error alert */}
          {formError && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-5">
              <AlertCircle size={15} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{formError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@gamexpay.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="
                    w-full px-3 py-2 pr-10 rounded-lg text-sm
                    bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                    transition-colors
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Demo Credentials</p>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-400">
                  <span className="text-violet-400 font-medium">Super Admin:</span>{' '}
                  superadmin@gamexpay.com / superadmin123
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">
                  <span className="text-gray-300 font-medium">Admin:</span>{' '}
                  admin@gamexpay.com / admin123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
