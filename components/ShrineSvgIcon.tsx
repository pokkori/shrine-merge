"use client";

/**
 * Inline SVG icons for each shrine level (1-9).
 * Replaces all emoji usage in shrine-related components.
 */
interface ShrineSvgIconProps {
  level: number;
  size?: number;
  className?: string;
}

export default function ShrineSvgIcon({ level, size = 32, className }: ShrineSvgIconProps) {
  const s = size;
  const common = { width: s, height: s, viewBox: "0 0 64 64", className, "aria-hidden": true as const };

  switch (level) {
    case 1: // Torii
      return (
        <svg {...common}>
          <rect x="8" y="10" width="48" height="6" rx="2" fill="#fff" />
          <rect x="12" y="16" width="40" height="4" rx="1" fill="#fca5a5" />
          <rect x="14" y="20" width="4" height="36" rx="1" fill="#fff" />
          <rect x="46" y="20" width="4" height="36" rx="1" fill="#fff" />
          <rect x="10" y="54" width="12" height="4" rx="1" fill="#fca5a5" />
          <rect x="42" y="54" width="12" height="4" rx="1" fill="#fca5a5" />
        </svg>
      );
    case 2: // Komainu
      return (
        <svg {...common}>
          <ellipse cx="32" cy="38" rx="16" ry="14" fill="#fff" />
          <ellipse cx="32" cy="52" rx="20" ry="6" fill="#e0c9a0" />
          <circle cx="25" cy="34" r="3" fill="#1a1a1a" />
          <circle cx="39" cy="34" r="3" fill="#1a1a1a" />
          <path d="M26 42 q6 4 12 0" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="20" cy="26" rx="6" ry="8" fill="#d4a867" />
          <ellipse cx="44" cy="26" rx="6" ry="8" fill="#d4a867" />
        </svg>
      );
    case 3: // Temizuya
      return (
        <svg {...common}>
          <rect x="10" y="30" width="44" height="6" rx="2" fill="#a0d8ef" />
          <rect x="8" y="36" width="48" height="12" rx="3" fill="#6ba3be" />
          <rect x="14" y="48" width="4" height="10" rx="1" fill="#8b7355" />
          <rect x="46" y="48" width="4" height="10" rx="1" fill="#8b7355" />
          <ellipse cx="32" cy="25" rx="3" ry="6" fill="#a0d8ef" opacity="0.7" />
          <rect x="30" y="14" width="4" height="16" rx="1" fill="#8b7355" />
          <circle cx="32" cy="40" r="3" fill="#a0d8ef" opacity="0.5" />
        </svg>
      );
    case 4: // Haiden
      return (
        <svg {...common}>
          <polygon points="32,8 56,24 8,24" fill="#fff" />
          <rect x="12" y="24" width="40" height="28" rx="2" fill="#f0e6d3" />
          <rect x="26" y="36" width="12" height="16" rx="1" fill="#8b5e3c" />
          <rect x="16" y="28" width="8" height="8" rx="1" fill="#d4a867" />
          <rect x="40" y="28" width="8" height="8" rx="1" fill="#d4a867" />
          <rect x="12" y="52" width="40" height="4" rx="1" fill="#8b7355" />
        </svg>
      );
    case 5: // Honden
      return (
        <svg {...common}>
          <polygon points="32,4 60,22 4,22" fill="#fff" />
          <polygon points="32,10 52,22 12,22" fill="#e0d5c0" />
          <rect x="10" y="22" width="44" height="30" rx="2" fill="#f5ebe0" />
          <rect x="24" y="34" width="16" height="18" rx="2" fill="#8b5e3c" />
          <line x1="32" y1="34" x2="32" y2="52" stroke="#6b4226" strokeWidth="1.5" />
          <circle cx="32" cy="30" r="3" fill="#d4af37" />
          <rect x="10" y="52" width="44" height="4" rx="1" fill="#8b7355" />
        </svg>
      );
    case 6: // Jingu
      return (
        <svg {...common}>
          <polygon points="32,2 62,20 2,20" fill="#c4b5fd" />
          <polygon points="32,6 54,20 10,20" fill="#a78bfa" />
          <rect x="8" y="20" width="48" height="32" rx="2" fill="#ede9fe" />
          <rect x="22" y="32" width="20" height="20" rx="2" fill="#7c3aed" />
          <line x1="32" y1="32" x2="32" y2="52" stroke="#6d28d9" strokeWidth="2" />
          <circle cx="32" cy="26" r="4" fill="#d4af37" />
          <rect x="14" y="24" width="6" height="10" rx="1" fill="#c4b5fd" />
          <rect x="44" y="24" width="6" height="10" rx="1" fill="#c4b5fd" />
          <rect x="8" y="52" width="48" height="4" rx="1" fill="#7c3aed" />
        </svg>
      );
    case 7: // Taisha
      return (
        <svg {...common}>
          <polygon points="32,0 64,18 0,18" fill="#fcd34d" />
          <polygon points="32,4 56,18 8,18" fill="#f59e0b" />
          <rect x="6" y="18" width="52" height="34" rx="2" fill="#fef3c7" />
          <rect x="20" y="28" width="24" height="24" rx="3" fill="#b45309" />
          <line x1="32" y1="28" x2="32" y2="52" stroke="#92400e" strokeWidth="2" />
          <circle cx="32" cy="22" r="5" fill="#d4af37" stroke="#92400e" strokeWidth="1" />
          <rect x="12" y="22" width="8" height="12" rx="1" fill="#f59e0b" />
          <rect x="44" y="22" width="8" height="12" rx="1" fill="#f59e0b" />
          <rect x="6" y="52" width="52" height="5" rx="2" fill="#b45309" />
        </svg>
      );
    case 8: // Souhonsha
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="g8" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#d4af37" />
            </linearGradient>
          </defs>
          <polygon points="32,0 64,16 0,16" fill="url(#g8)" />
          <polygon points="32,4 56,16 8,16" fill="#fde68a" />
          <rect x="4" y="16" width="56" height="36" rx="3" fill="#fffbeb" />
          <rect x="18" y="26" width="28" height="26" rx="3" fill="#d4af37" />
          <line x1="32" y1="26" x2="32" y2="52" stroke="#92400e" strokeWidth="2" />
          <circle cx="32" cy="20" r="6" fill="#fcd34d" stroke="#b8860b" strokeWidth="1.5" />
          <rect x="10" y="20" width="10" height="14" rx="2" fill="#fde68a" />
          <rect x="44" y="20" width="10" height="14" rx="2" fill="#fde68a" />
          <rect x="4" y="52" width="56" height="6" rx="2" fill="#b8860b" />
          <circle cx="16" cy="10" r="2" fill="#fcd34d" opacity="0.6" />
          <circle cx="48" cy="10" r="2" fill="#fcd34d" opacity="0.6" />
        </svg>
      );
    case 9: // Amaterasu
      return (
        <svg {...common}>
          <defs>
            <radialGradient id="g9" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="60%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#d4af37" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="28" r="22" fill="url(#g9)" opacity="0.3" />
          <circle cx="32" cy="28" r="14" fill="url(#g9)" />
          {/* Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1={32 + 16 * Math.cos((angle * Math.PI) / 180)}
              y1={28 + 16 * Math.sin((angle * Math.PI) / 180)}
              x2={32 + 26 * Math.cos((angle * Math.PI) / 180)}
              y2={28 + 26 * Math.sin((angle * Math.PI) / 180)}
              stroke="#fcd34d"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.8"
            />
          ))}
          <text x="32" y="34" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#92400e">
            神
          </text>
          <rect x="16" y="52" width="32" height="6" rx="2" fill="#d4af37" />
          <rect x="22" y="48" width="20" height="4" rx="1" fill="#fde68a" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="20" fill="#d4af37" />
          <text x="32" y="38" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">?</text>
        </svg>
      );
  }
}
