import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields.');
      }
      
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        throw new Error('Invalid email or password.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center relative overflow-hidden px-4 py-20">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-secondary-100/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl">
        <div className="text-center space-y-3 mb-8">
          <Link to="/" className="inline-flex flex-col items-center space-y-2 group">
            <img 
              src="/logo.png" 
              className="h-14 w-14 object-contain bg-white rounded-2xl p-0.5 shadow-md border border-slate-100" 
              alt="NayePankh Logo" 
            />
            <span className="text-2xl font-black tracking-wider text-slate-900">
              Naye<span className="text-primary-600">Pankh</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold">Welcome Back</h2>
          <p className="text-slate-500 text-xs">Enter your details to access your dashboard.</p>
          
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-red-600 text-xs mb-6">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-primary-500 transition-colors placeholder-slate-400"
                placeholder="admin@nayepankh.org"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline font-bold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-primary-500 transition-colors placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-sm shadow transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:underline font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
