'use client';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Dummy check (belum konek backend)
    if (username === 'admin' && password === 'admin') {
      setMessage('✅ Login sukses!');
      redirect('/dashboard');
    } else {
      setMessage('❌ Username atau password salah!');
    }
  };

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
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Login
        </button>

        {message && (
          <p
            className={`text-center text-sm font-medium ${
              message.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
