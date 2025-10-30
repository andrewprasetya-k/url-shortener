'use client';

import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = 'Konfirmasi',
  message = 'Apakah kamu yakin ingin melanjutkan?',
  confirmText = 'Ya',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* Modal box */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 z-10 animate-fadeIn">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white cursor-pointer hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
