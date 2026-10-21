import React, { useState } from 'react';
import { audioService } from '../services/audioService';

interface MascotSparkyProps {
  size?: 'sm' | 'md' | 'lg';
  speechBubble?: string;
  subtext?: string;
  interactive?: boolean;
  onMascotClick?: () => void;
  className?: string;
}

export const MascotSparky: React.FC<MascotSparkyProps> = ({
  size = 'md',
  speechBubble,
  subtext,
  interactive = true,
  onMascotClick,
  className = '',
}) => {
  const [isWaving, setIsWaving] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  const handleClick = () => {
    setIsWaving(true);
    setIsBlinking(true);
    audioService.playStarSound();
    audioService.speak("Hello friend! Let's learn English with Sparky!");
    setTimeout(() => setIsWaving(false), 1200);
    setTimeout(() => setIsBlinking(false), 800);
    if (onMascotClick) onMascotClick();
  };

  const dimensions = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
  }[size];

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      {/* Speech Bubble if present */}
      {speechBubble && (
        <div className="relative bg-white/95 backdrop-blur-sm border-2 border-indigo-200 text-slate-800 rounded-2xl p-3 shadow-md text-sm max-w-xs animate-in fade-in zoom-in-95 duration-200">
          <p className="font-bold text-indigo-900 leading-snug">{speechBubble}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1 leading-tight">{subtext}</p>}
          {/* Arrow */}
          <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-b-2 border-r-2 border-indigo-200 transform rotate-45" />
        </div>
      )}

      {/* Robot Mascot SVG */}
      <button
        type="button"
        onClick={interactive ? handleClick : undefined}
        title="Nhấn vào Robot Sparky để nghe chào bạn!"
        className={`${dimensions} relative group transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none`}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Robot body gradient */}
            <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>

            {/* Belly screen gradient */}
            <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fdf4ff" />
              <stop offset="100%" stopColor="#fae8ff" />
            </linearGradient>

            {/* Earphone gradient */}
            <linearGradient id="headphoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>

            {/* Headphone band gradient */}
            <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>

          {/* Headphone Arch Band over head */}
          <path
            d="M 46 80 A 54 54 0 0 1 154 80"
            fill="none"
            stroke="url(#bandGrad)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Antenna */}
          <line x1="100" y1="46" x2="100" y2="28" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          <circle cx="100" cy="24" r="8" fill="#fbbf24" className="animate-pulse" />
          <circle cx="100" cy="24" r="4" fill="#fef08a" />

          {/* Robot Head */}
          <rect
            x="50"
            y="50"
            width="100"
            height="80"
            rx="24"
            fill="url(#robotBodyGrad)"
            stroke="#60a5fa"
            strokeWidth="3"
          />

          {/* Screen Face */}
          <rect
            x="62"
            y="62"
            width="76"
            height="56"
            rx="14"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="2"
          />

          {/* Eyes (Glowing Cyan / Friendly) */}
          <ellipse
            cx="82"
            cy={isBlinking ? '88' : '84'}
            rx="9"
            ry={isBlinking ? '2' : '10'}
            fill="#38bdf8"
          />
          {!isBlinking && <circle cx="85" cy="81" r="3.5" fill="#ffffff" />}

          <ellipse
            cx="118"
            cy={isBlinking ? '88' : '84'}
            rx="9"
            ry={isBlinking ? '2' : '10'}
            fill="#38bdf8"
          />
          {!isBlinking && <circle cx="121" cy="81" r="3.5" fill="#ffffff" />}

          {/* Rosy Cheeks */}
          <circle cx="72" cy="100" r="5" fill="#f43f5e" opacity="0.6" />
          <circle cx="128" cy="100" r="5" fill="#f43f5e" opacity="0.6" />

          {/* Cheerful Smile */}
          <path
            d="M 90 98 Q 100 108 110 98"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Headphones Earcups */}
          {/* Left Earcup */}
          <rect x="36" y="66" width="16" height="34" rx="8" fill="url(#headphoneGrad)" stroke="#fda4af" strokeWidth="2" />
          <rect x="42" y="74" width="4" height="18" rx="2" fill="#ffffff" opacity="0.5" />

          {/* Right Earcup with Mic arm */}
          <rect x="148" y="66" width="16" height="34" rx="8" fill="url(#headphoneGrad)" stroke="#fda4af" strokeWidth="2" />
          <rect x="154" y="74" width="4" height="18" rx="2" fill="#ffffff" opacity="0.5" />
          {/* Mic Arm curving to mouth */}
          <path
            d="M 152 90 Q 146 116 118 112"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="116" cy="112" r="5" fill="#e11d48" />

          {/* Neck Joint */}
          <rect x="88" y="130" width="24" height="8" rx="3" fill="#64748b" />

          {/* Robot Torso / Body */}
          <path
            d="M 64 138 Q 100 134 136 138 L 144 186 Q 100 190 56 186 Z"
            fill="url(#robotBodyGrad)"
            stroke="#60a5fa"
            strokeWidth="2.5"
          />

          {/* Belly Badge: Golden English Spark Star */}
          <rect x="76" y="146" width="48" height="34" rx="10" fill="url(#screenGrad)" stroke="#e2e8f0" strokeWidth="1.5" />
          {/* 5-pointed Star inside */}
          <path
            d="M 100 150 L 103 158 L 111 158 L 105 163 L 107 171 L 100 166 L 93 171 L 95 163 L 89 158 L 97 158 Z"
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="1"
          />

          {/* Left Hand / Arm */}
          <g className={isWaving ? 'animate-bounce' : ''}>
            <path
              d="M 58 146 Q 36 156 42 174"
              fill="none"
              stroke="#2563eb"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle cx="42" cy="174" r="7" fill="#38bdf8" stroke="#1d4ed8" strokeWidth="2" />
          </g>

          {/* Right Hand / Arm (Waving) */}
          <g className={isWaving ? 'origin-[142px_146px] -rotate-12 duration-200' : ''}>
            <path
              d="M 142 146 Q 166 148 160 134"
              fill="none"
              stroke="#2563eb"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle cx="160" cy="132" r="7" fill="#38bdf8" stroke="#1d4ed8" strokeWidth="2" />
          </g>
        </svg>
      </button>
    </div>
  );
};
