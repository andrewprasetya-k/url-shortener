import React from 'react';

/**
 * A simple, modern logo for "Lynks".
 * It consists of a stylized link icon and the application name.
 * The component accepts standard SVG props for customization.
 */
export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <a href='/dashboard'>
    <svg
      width="125"
      height="32"
      viewBox="0 0 125 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="lynks-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      
      {/* Icon part */}
      <g transform="translate(2, 2) scale(0.9)">
        <path 
          d="M12 18H7C4.23858 18 2 15.7614 2 13V13C2 10.2386 4.23858 8 7 8H12" 
          stroke="url(#lynks-gradient)" 
          strokeWidth="3.5" 
          strokeLinecap="round"
        />
        <path 
          d="M17 8H22C24.7614 8 27 10.2386 27 13V13C27 15.7614 24.7614 18 22 18H17" 
          stroke="url(#lynks-gradient)" 
          strokeWidth="3.5" 
          strokeLinecap="round"
        />
      </g>
      
      {/* Text part */}
      <text
        x="38"
        y="23"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="22"
        fontWeight="600"
        fill="currentColor"
      >
        Lynks
      </text>
    </svg>
    </a>
  );
}
