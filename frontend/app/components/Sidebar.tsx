'use client';
import { useState } from 'react';
import { Menu, X, Home, LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { sidebar } from '../config';
import ConfirmModal from './ConfirmModal';
import { getApiUrl } from '../../lib/api-config';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const logout = async () => {
    try {
      await fetch(getApiUrl('auth/logout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      document.cookie = 'access_token=; path=/; max-age=0';
      window.location.href = '/login';
    }
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
        className={`fixed top-0 left-0 h-full ${sidebar.width} p-4 py-6 transform transition-transform duration-300 z-40 flex flex-col justify-between
        ${open ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}      >
        <div>
          <h2 className="text-2xl font-bold pl-2 mb-6 text-gray-700" >Url Shortener</h2>

          <nav className="space-y-3">
            <Link
              href="/dashboard"
              className="flex text-white items-center gap-2 p-2 rounded bg-blue-600 transition hover:bg-blue-700"
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>

          </nav>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
            className="w-full text-left text-white bg-red-600 flex items-center gap-2 p-2 rounded hover:bg-red-700 transition cursor-pointer"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar?"
        confirmText="Ya, Logout"
        cancelText="Batal"
        onConfirm={logout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
