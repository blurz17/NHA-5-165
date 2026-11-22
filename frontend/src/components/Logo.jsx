import React from 'react';

export default function Logo({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.4))' }}
    >
      <defs>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="0.5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="heatGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316" />
          <stop offset="1" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="coolGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Isometric Cube Top Face (Roof) */}
      <polygon points="32,4 58,18 32,32 6,18" fill="url(#roofGrad)" fillOpacity="0.95" />

      {/* Left Wall (Cooling facade) */}
      <polygon points="6,18 32,32 32,60 6,46" fill="url(#coolGrad)" fillOpacity="0.85" />

      {/* Right Wall (Heating facade) */}
      <polygon points="32,32 58,18 58,46 32,60" fill="url(#heatGrad)" fillOpacity="0.85" />

      {/* Architectural Wireframe Grid lines */}
      <line x1="32" y1="4" x2="32" y2="32" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" />
      <line x1="32" y1="32" x2="58" y2="18" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" />
      <line x1="32" y1="32" x2="6" y2="18" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" />
      <line x1="32" y1="32" x2="32" y2="60" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.9" />

      {/* Central Thermal Energy Core Glow */}
      <circle cx="32" cy="32" r="5" fill="#ffffff" />
      <circle cx="32" cy="32" r="9" fill="#38bdf8" fillOpacity="0.4" />
    </svg>
  );
}
