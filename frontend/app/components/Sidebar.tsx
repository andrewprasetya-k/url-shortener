'use client';
import { useState } from 'react';
import { Menu, X, Home, LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { sidebar } from '../config';

export default function Sidebar() {
  const [open, setOpen] = useState(false);

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
        <h2 className="text-2xl font-bold text-center mb-10">Url Shortner</h2>

        <nav className="space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 transition"
          >
            <Home size={18} /> Home
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 transition"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 transition"
          >
            <LogOut size={18} /> Logout
          </Link>
        </nav>
      </aside>
    </>
  );
}
