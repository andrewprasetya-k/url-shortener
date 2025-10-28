'use client';
import { useState } from 'react';
import { Menu, X, Home, LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { sidebar } from '../config';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const logout = async () => {
    await fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') }),
    });
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }
  return (
    <>
      {/* Tombol toggle (muncul di layar kecil) */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden fixed top-4 left-4 z-100 bg-blue-600 text-white p-2 rounded-md"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full text-gray-700 ${sidebar.width} p-4 py-6 space-y-6 transform transition-transform duration-300 z-40
        ${open ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}      >
        <h2 className="text-2xl font-bold pl-2 mb-10">Url Shortener</h2>

        <nav className="space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 p-2 rounded bg-gray-200 transition"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>

            <button
            type="button"
            onClick={logout}
            aria-label="Logout"
            className="w-full text-left flex items-center gap-2 p-2 rounded hover:bg-gray-200 transition"
            >
            <LogOut size={18} /> Logout
            </button>
        </nav>
      </aside>
    </>
  );
}
