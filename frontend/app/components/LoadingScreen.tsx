'use client';

import React from 'react';

export default function LoadingScreen({ title = "Preparing Your Dashboard", subtitle = "Please hold on while we fetch your latest data and secure your session." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-6">
        {/* Elegant spinner */}
        <div className="relative h-20 w-20 mx-auto">
          <svg
            className="animate-spin-slow text-blue-500"
            viewBox="0 0 50 50"
          >
            <circle
              className="opacity-25"
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M25 5a20 20 0 0 1 20 20h-4a16 16 0 0 0-16-16V5z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
          {title}
        </h2>

        {/* Subtext */}
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          {subtitle}
        </p>

        {/* Subtle dots animation */}
        <div className="flex items-center justify-center gap-1 mt-4">
          <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce"></span>
          <span
            className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></span>
          <span
            className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></span>
        </div>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 2.5s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
