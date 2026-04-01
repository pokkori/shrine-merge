"use client";

import React from "react";

interface IconProps {
  size?: number;
  className?: string;
}

/** 鳥居アイコン */
export function ToriiSmallIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 上部横棒（笠木） */}
      <rect x="1" y="3" width="22" height="2.5" rx="1.2" fill="#d4af37" />
      {/* 二本目横棒（貫） */}
      <rect x="3" y="7" width="18" height="2" rx="1" fill="#d4af37" />
      {/* 左柱 */}
      <rect x="5" y="9" width="2.5" height="13" rx="1.25" fill="#d4af37" />
      {/* 右柱 */}
      <rect x="16.5" y="9" width="2.5" height="13" rx="1.25" fill="#d4af37" />
      {/* 笠木の左右突出 */}
      <rect x="0" y="2.5" width="3" height="3" rx="1.5" fill="#d4af37" />
      <rect x="21" y="2.5" width="3" height="3" rx="1.5" fill="#d4af37" />
    </svg>
  );
}

/** 本/図鑑アイコン */
export function BookIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="14" height="18" rx="2" fill="#d4af37" opacity="0.85" />
      <rect x="17" y="3" width="4" height="18" rx="1" fill="#c4902d" />
      <rect x="6" y="7" width="8" height="1.5" rx="0.75" fill="#1a0a00" opacity="0.5" />
      <rect x="6" y="10.5" width="8" height="1.5" rx="0.75" fill="#1a0a00" opacity="0.5" />
      <rect x="6" y="14" width="5" height="1.5" rx="0.75" fill="#1a0a00" opacity="0.5" />
      <rect x="3" y="3" width="14" height="18" rx="2" fill="none" stroke="#c4902d" strokeWidth="1" />
    </svg>
  );
}

/** 音符（ミュートON）アイコン */
export function MuteOnIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* スピーカー本体 */}
      <polygon points="3,9 3,15 7,15 12,19 12,5 7,9" fill="#d4af37" />
      {/* 波形1 */}
      <path d="M15 9.5 C16.5 10.5 16.5 13.5 15 14.5" stroke="#d4af37" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* 波形2 */}
      <path d="M17.5 7.5 C20 9 20 15 17.5 16.5" stroke="#d4af37" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** スラッシュ付き音符（ミュートOFF）アイコン */
export function MuteOffIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* スピーカー本体 */}
      <polygon points="3,9 3,15 7,15 12,19 12,5 7,9" fill="#6b7280" />
      {/* スラッシュ */}
      <line x1="4" y1="4" x2="20" y2="20" stroke="#6b7280" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** 5角星アイコン */
export function StarIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill="#fcd34d"
        stroke="#f59e0b"
        strokeWidth="0.5"
      />
    </svg>
  );
}

/** 鐘アイコン */
export function BellIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 鐘の本体 */}
      <path d="M12 3 C8 3 6 6.5 6 10 L6 16 L18 16 L18 10 C18 6.5 16 3 12 3 Z" fill="#d4af37" />
      {/* 頂上の輪 */}
      <circle cx="12" cy="3" r="1.5" fill="#c4902d" />
      {/* ベースライン */}
      <rect x="4" y="16" width="16" height="2" rx="1" fill="#d4af37" />
      {/* 打ち棒の下の飾り */}
      <path d="M10 18 Q12 21 14 18" stroke="#d4af37" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** 巻物/おみくじ棒アイコン */
export function OmikujiScrollIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 棒 */}
      <rect x="11" y="13" width="2.5" height="8" rx="1.25" fill="#c4902d" />
      {/* 巻物本体 */}
      <rect x="4" y="4" width="16" height="11" rx="2" fill="#fef3c7" stroke="#d4af37" strokeWidth="1.2" />
      {/* 横棒（上） */}
      <rect x="2" y="3" width="20" height="2.5" rx="1.25" fill="#d4af37" />
      {/* 横棒（下） */}
      <rect x="2" y="12" width="20" height="2.5" rx="1.25" fill="#d4af37" />
      {/* テキスト線 */}
      <rect x="7" y="7" width="10" height="1" rx="0.5" fill="#92400e" opacity="0.5" />
      <rect x="7" y="9.5" width="7" height="1" rx="0.5" fill="#92400e" opacity="0.5" />
    </svg>
  );
}

/** リトライ（矢印）アイコン */
export function RetryIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1 4 L1 10 L7 10"
        stroke="#1a0a00"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.51 15 C4.45 17.46 6.62 19.38 9.36 19.84 C13.36 20.5 17.19 17.85 17.85 13.85 C18.51 9.85 15.86 6.02 11.86 5.36 C9.07 4.9 6.42 5.97 4.76 7.92 L1 10"
        stroke="#1a0a00"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 桜花びらSVG（パーティクル用） */
export function SakuraPetalSvg({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 5弁の桜花びら */}
      <g transform="translate(20,20)">
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-9"
            rx="5"
            ry="9"
            fill="#ffb7c5"
            transform={`rotate(${angle})`}
            opacity="0.9"
          />
        ))}
        <circle cx="0" cy="0" r="3" fill="#ff8fab" />
      </g>
    </svg>
  );
}
