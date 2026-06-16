import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('Please fill in all fields.');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }
      
      const success = await register(email, password, name);
      if (success) {
        navigate('/');
      } else {
        throw new Error('Registration failed.');
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
          <h2 className="text-xl font-bold">Create Account</h2>
          <p className="text-slate-500 text-xs">Join our network and manage your sponsorship profiles.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-red-600 text-xs mb-6">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-primary-500 transition-colors placeholder-slate-400"
                placeholder="Manish Shukla"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-primary-500 transition-colors placeholder-slate-400"
                placeholder="manishoff@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-primary-500 transition-colors placeholder-slate-400"
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-primary-500 transition-colors placeholder-slate-400"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-sm shadow transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:underline font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
