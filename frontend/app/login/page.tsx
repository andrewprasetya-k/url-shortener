'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';

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
      const res = await fetch('http://localhost:3000/auth/login', {
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
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-100 via-white to-blue-200">
      <form
        onSubmit={handleLogin}
        className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-5"
      >
        <h1 className="text-3xl font-extrabold text-center text-blue-700">
          Login
        </h1>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>

        <a href="/register" className='text-blue-400 mx-auto'>register</a>

        {message && (
          <p
            className={`text-center text-sm font-medium ${
              message.includes('successful') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
