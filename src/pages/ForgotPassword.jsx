import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      if (!email) {
        throw new Error('Please enter your email address.');
      }
      
      const res = await resetPassword(email);
      if (res) {
        setSuccess(true);
      } else {
        throw new Error('Could not send password reset email. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
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
          <h2 className="text-xl font-bold">Reset Password</h2>
          <p className="text-slate-500 text-xs">Enter your email and we'll send you a password recovery link.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-red-600 text-xs mb-6">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-base">Check your inbox</h3>
              <p className="text-slate-550 text-xs leading-relaxed max-w-xs mx-auto">
                We've sent a password reset link to <strong className="text-slate-800">{email}</strong>. Please check your email inbox and spam folder.
              </p>
            </div>
            <div className="pt-4">
              <Link 
                to="/login"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary-600 hover:text-primary-750 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
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
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-sm shadow transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {loading ? 'Sending Request...' : 'Send Recovery Link'}
            </button>

            <div className="text-center pt-2">
              <Link 
                to="/login"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
