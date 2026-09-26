import React from 'react';

// Detailed Gateway of India illustration in sage tones matching mockup
export const GatewayIllustration: React.FC<{ className?: string; color?: string; opacity?: number }> = ({
  className = "w-56 h-36",
  color = "#2D634E",
  opacity = 0.85
}) => (
  <svg viewBox="0 0 340 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g opacity={opacity}>
      {/* Distant soft sky aura */}
      <ellipse cx="170" cy="130" rx="140" ry="70" fill="#E0EEE7" fillOpacity="0.4" />
      
      {/* Distant heritage buildings / skyline */}
      <rect x="25" y="115" width="28" height="65" fill="#D3E5DC" stroke={color} strokeWidth="1" opacity="0.6" />
      <polygon points="25,115 39,95 53,115" fill="#D3E5DC" stroke={color} strokeWidth="1" opacity="0.6" />
      <rect x="60" y="125" width="24" height="55" fill="#D3E5DC" stroke={color} strokeWidth="1" opacity="0.5" />
      
      <rect x="255" y="120" width="26" height="60" fill="#D3E5DC" stroke={color} strokeWidth="1" opacity="0.5" />
      <rect x="285" y="110" width="30" height="70" fill="#D3E5DC" stroke={color} strokeWidth="1" opacity="0.6" />
      <polygon points="285,110 300,90 315,110" fill="#D3E5DC" stroke={color} strokeWidth="1" opacity="0.6" />

      {/* Main Central Gateway Arch */}
      <rect x="95" y="55" width="150" height="125" rx="3" fill="#E8F3ED" stroke={color} strokeWidth="2.5" />
      
      {/* Central Grand Archway Opening */}
      <path
        d="M135 180 V 110 Q 170 70, 205 110 V 180"
        fill="#FFFFFF"
        stroke={color}
        strokeWidth="2.5"
      />
      
      {/* Side Arches (Left & Right Window alcoves) */}
      <path d="M106 135 V 105 Q 118 90, 130 105 V 135 Z" fill="#DCECE4" stroke={color} strokeWidth="1.5" />
      <path d="M210 135 V 105 Q 222 90, 234 105 V 135 Z" fill="#DCECE4" stroke={color} strokeWidth="1.5" />

      {/* Left Main Turret */}
      <rect x="80" y="45" width="25" height="135" fill="#E0EFE8" stroke={color} strokeWidth="2" />
      <path d="M78 45 L92.5 18 L107 45 Z" fill="#D5EBE0" stroke={color} strokeWidth="2" />
      <circle cx="92.5" cy="15" r="2.5" fill={color} />

      {/* Right Main Turret */}
      <rect x="235" y="45" width="25" height="135" fill="#E0EFE8" stroke={color} strokeWidth="2" />
      <path d="M233 45 L247.5 18 L262 45 Z" fill="#D5EBE0" stroke={color} strokeWidth="2" />
      <circle cx="247.5" cy="15" r="2.5" fill={color} />

      {/* Central Parapet & Top Dome */}
      <rect x="105" y="40" width="130" height="16" fill="#D8ECE1" stroke={color} strokeWidth="2" />
      <path d="M148 40 Q 170 20, 192 40 Z" fill="#D0E7DC" stroke={color} strokeWidth="2" />
      <line x1="170" y1="20" x2="170" y2="12" stroke={color} strokeWidth="2" />
      <circle cx="170" cy="10" r="2.5" fill={color} />

      {/* Fine architectural jali work horizontal lines */}
      <line x1="95" y1="72" x2="245" y2="72" stroke={color} strokeWidth="1.2" strokeDasharray="3 2" />
      <line x1="95" y1="88" x2="245" y2="88" stroke={color} strokeWidth="1.2" strokeDasharray="3 2" />

      {/* Harbor Promenade / Steps */}
      <line x1="10" y1="180" x2="330" y2="180" stroke={color} strokeWidth="3" />
      <line x1="20" y1="187" x2="320" y2="187" stroke={color} strokeWidth="1.5" />
      <line x1="30" y1="193" x2="310" y2="193" stroke={color} strokeWidth="1" strokeDasharray="6 3" />

      {/* Trees / Foliage on Left and Right shores */}
      <circle cx="20" cy="175" r="10" fill="#9FCBB5" stroke={color} strokeWidth="1" />
      <circle cx="320" cy="175" r="10" fill="#9FCBB5" stroke={color} strokeWidth="1" />
      <circle cx="10" cy="178" r="7" fill="#88BC9E" stroke={color} strokeWidth="1" />
      <circle cx="330" cy="178" r="7" fill="#88BC9E" stroke={color} strokeWidth="1" />
    </g>
  </svg>
);

// Municipal Victorian building for bottom sidebar
export const CivicDomeIllustration: React.FC<{ className?: string }> = ({
  className = "w-full h-20 text-[#1B4D3E]"
}) => (
  <svg viewBox="0 0 240 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g opacity="0.85" stroke="currentColor" strokeWidth="1.3">
      {/* Central grand municipal dome */}
      <path d="M95 70 V 42 Q 120 12, 145 42 V 70" fill="#E8F4EE" />
      <line x1="120" y1="12" x2="120" y2="4" strokeWidth="1.8" />
      <circle cx="120" cy="3" r="2" fill="currentColor" />
      <rect x="105" y="48" width="30" height="15" rx="2" fill="#D8ECE2" />
      <line x1="112" y1="48" x2="112" y2="63" />
      <line x1="128" y1="48" x2="128" y2="63" />
      
      {/* Left colonnade wing */}
      <rect x="45" y="48" width="50" height="22" fill="#E8F4EE" />
      <polygon points="45,48 70,35 95,48" fill="#D8ECE2" />
      
      {/* Right colonnade wing */}
      <rect x="145" y="48" width="50" height="22" fill="#E8F4EE" />
      <polygon points="145,48 170,35 195,48" fill="#D8ECE2" />

      {/* Base line */}
      <line x1="15" y1="70" x2="225" y2="70" strokeWidth="2" />
      {/* Soft trees */}
      <circle cx="30" cy="65" r="7" fill="#A4D1BD" strokeWidth="1" />
      <circle cx="210" cy="65" r="7" fill="#A4D1BD" strokeWidth="1" />
    </g>
  </svg>
);
