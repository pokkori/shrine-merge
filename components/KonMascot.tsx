"use client";

import React from "react";

export type KonPose = "idle" | "happy" | "excited" | "sad";

interface KonMascotProps {
  pose: KonPose;
  size?: number;
}

/**
 * 狐マスコット「コン」
 * pose に応じてCSSアニメーションを切り替えます
 */
export default function KonMascot({ pose, size = 80 }: KonMascotProps) {
  const animationStyle = React.useMemo<React.CSSProperties>(() => {
    switch (pose) {
      case "idle":
        return { animation: "kon-float 3s ease-in-out infinite" };
      case "happy":
        return { animation: "kon-bounce 0.6s ease-in-out infinite", transform: "scale(1.3)" };
      case "excited":
        return { animation: "kon-spin 0.8s linear infinite", transformOrigin: "center" };
      case "sad":
        return { animation: "kon-shake 0.5s ease-in-out infinite" };
      default:
        return {};
    }
  }, [pose]);

  return (
    <>
      <style>{`
        @keyframes kon-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes kon-bounce {
          0%, 100% { transform: scale(1.3) translateY(0); }
          50% { transform: scale(1.4) translateY(-6px); }
        }
        @keyframes kon-spin {
          0% { transform: scale(1.5) rotate(0deg); }
          100% { transform: scale(1.5) rotate(360deg); }
        }
        @keyframes kon-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={animationStyle}
        aria-label={`狐マスコット コン（${pose}）`}
        role="img"
      >
        {/* 尻尾 */}
        <ellipse cx="62" cy="58" rx="12" ry="6" fill="#f97316" transform="rotate(-20 62 58)" />
        <ellipse cx="65" cy="56" rx="7" ry="3.5" fill="#fff7ed" transform="rotate(-20 65 56)" />

        {/* 体 */}
        <ellipse cx="40" cy="52" rx="18" ry="14" fill="#f97316" />

        {/* 左耳 */}
        <polygon points="18,28 12,8 28,22" fill="#f97316" />
        <polygon points="19,26 15,12 26,22" fill="#fbbf24" />

        {/* 右耳 */}
        <polygon points="62,28 68,8 52,22" fill="#f97316" />
        <polygon points="61,26 65,12 54,22" fill="#fbbf24" />

        {/* 顔（丸い） */}
        <circle cx="40" cy="36" r="20" fill="#fb923c" />

        {/* 白い頬 */}
        <ellipse cx="28" cy="40" rx="6" ry="4" fill="#fff7ed" opacity="0.8" />
        <ellipse cx="52" cy="40" rx="6" ry="4" fill="#fff7ed" opacity="0.8" />

        {/* 鼻先の白 */}
        <ellipse cx="40" cy="36" rx="10" ry="7" fill="#fff7ed" opacity="0.6" />

        {/* 目（pose別） */}
        {pose === "sad" ? (
          <>
            {/* 悲しい目（への字） */}
            <path d="M32 32 Q35 29 38 32" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M42 32 Q45 29 48 32" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* 涙 */}
            <ellipse cx="33" cy="37" rx="2" ry="3" fill="#60a5fa" opacity="0.9" />
            <ellipse cx="47" cy="37" rx="2" ry="3" fill="#60a5fa" opacity="0.9" />
          </>
        ) : pose === "excited" ? (
          <>
            {/* 興奮した目（きらきら） */}
            <circle cx="35" cy="33" r="5" fill="#1a0a00" />
            <circle cx="45" cy="33" r="5" fill="#1a0a00" />
            <circle cx="37" cy="31" r="2" fill="white" />
            <circle cx="47" cy="31" r="2" fill="white" />
            <circle cx="34" cy="34" r="1" fill="white" />
            <circle cx="44" cy="34" r="1" fill="white" />
          </>
        ) : (
          <>
            {/* 通常・嬉しい目 */}
            <circle cx="35" cy="33" r="5" fill="#1a0a00" />
            <circle cx="45" cy="33" r="5" fill="#1a0a00" />
            <circle cx="37" cy="31" r="2" fill="white" />
            <circle cx="47" cy="31" r="2" fill="white" />
          </>
        )}

        {/* 鼻 */}
        <ellipse cx="40" cy="39" rx="2.5" ry="1.8" fill="#c2410c" />

        {/* 口（pose別） */}
        {pose === "sad" ? (
          <path d="M35 43 Q40 41 45 43" stroke="#c2410c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        ) : pose === "excited" || pose === "happy" ? (
          <path d="M34 42 Q40 47 46 42" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M35 42 Q40 45 45 42" stroke="#c2410c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        )}

        {/* excited専用: 星エフェクト */}
        {pose === "excited" && (
          <>
            <polygon points="10,10 11.5,14 15.5,14 12.5,16.5 13.5,20.5 10,18 6.5,20.5 7.5,16.5 4.5,14 8.5,14" fill="#fcd34d" opacity="0.9" />
            <polygon points="70,12 71,15 74,15 71.5,17 72.5,20 70,18.5 67.5,20 68.5,17 66,15 69,15" fill="#fcd34d" opacity="0.9" />
          </>
        )}

        {/* happy専用: ほっぺた赤み */}
        {pose === "happy" && (
          <>
            <ellipse cx="27" cy="41" rx="5" ry="3" fill="#fca5a5" opacity="0.6" />
            <ellipse cx="53" cy="41" rx="5" ry="3" fill="#fca5a5" opacity="0.6" />
          </>
        )}
      </svg>
    </>
  );
}
