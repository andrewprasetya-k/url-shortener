'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../components/LoadingScreen';
import { getApiUrl } from '../../lib/api-config';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('register');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Kode OTP telah dikirim ke email anda!');
        setStep('verify');
      } else {
        setMessage(`${data.message || 'Register account failed'}`);
      }
    } catch (error:any) {
      setMessage(error.message || "An error occurred");
    }
    finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('auth/register/verify'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Verifikasi OTP berhasil! Silakan masuk.');
        router.push('/login');
      } else {
        setMessage(`${data.message || 'Verifikasi OTP gagal.'}`);
      }
    }
    catch (error:any) {
      setMessage(error.message || "An error occurred");
    }
    finally {
      setLoading(false);
    }
  }

  // Show loading screen saat register process
  if (loading) {
    return <LoadingScreen />;
  }

  return (
  <div className="flex min-h-screen bg-white">
    {/* Left Pane (Branding) */}
    <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-linear-to-br from-blue-600 to-indigo-700 p-12 text-white relative overflow-hidden">
      <div className="z-10">
        <div className="mb-8">
          <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.09L7.41 13.5l1.41-1.41L11 14.67l4.59-4.59L17 11.5l-6 6.09z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          Mulai Perjalanan Anda Bersama Kami
        </h1>
        <p className="text-indigo-200 max-w-md">
          Buat akun untuk memendekkan URL, melacak klik, dan mengelola tautan Anda dengan mudah.
        </p>
      </div>
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 md:translate-x-1/2 md:translate-y-1/2"></div>
    </div>

    {/* Right Pane (Form) */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
      <div className="w-full max-w-md">
        {loading && <LoadingScreen />}

        {!loading && step === 'register' ? (
          // REGISTER FORM
          <div>
            <div className="text-left mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Buat Akun</h1>
              <p className="text-gray-500 text-sm">Selamat datang! Silakan isi detail Anda.</p>
            </div>
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input type="text" placeholder="e.g., john_doe" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              {message && <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('berhasil') || message.includes('telah dikirim') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>}
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md">Buat Akun</button>
              <p className="text-center text-sm text-gray-600">
                Sudah punya akun? <a href="/login" className="text-blue-600 hover:underline font-medium">Masuk di sini</a>
              </p>
            </form>
          </div>
        ) : !loading && (
          // OTP VERIFICATION FORM
          <div>
            <div className="text-left mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Verifikasi Email</h1>
              <p className="text-gray-500 text-sm">Masukkan kode 6 digit yang dikirim ke <strong>{email}</strong></p>
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kode OTP</label>
                <input type="text" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required maxLength={6} />
              </div>
              {message && <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('berhasil') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>}
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md">Verifikasi & Buat Akun</button>
              <p className="text-center text-sm text-gray-600">
                Tidak menerima kode? <button type="button" onClick={() => setStep('register')} className="text-blue-600 hover:underline font-medium">Kirim ulang</button>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  </div>
);}