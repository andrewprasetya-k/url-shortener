'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import LoadingScreen from '../components/LoadingScreen';
import { getApiUrl } from '../../lib/api-config';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Simpan token ke localStorage dan cookies
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        document.cookie = `access_token=${data.access_token}; path=/; max-age=900`;
        
        // Redirect menggunakan router.push
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        setMessage(`${data.message || 'Login failed'}`);
      }
    } catch (error:any) {
      setMessage(error.message || "An error occurred");
    }
    finally {
      setLoading(false);
    }
  };

  // Show loading screen saat login process
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                message.includes('successful') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a 
                href="/register" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Create account
              </a>
            </p>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}