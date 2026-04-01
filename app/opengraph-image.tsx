import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(160deg, #1a0a00, #3d1f00, #1a0a00)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(255,200,0,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        {/* Icon */}
        <div style={{ marginBottom: 24, filter: "drop-shadow(0 0 30px rgba(255,200,0,0.6))" }}>
          <svg viewBox="0 0 120 120" width={120} height={120}>
            <rect x="10" y="18" width="100" height="14" rx="4" fill="#DC2626" />
            <rect x="6" y="30" width="108" height="8" rx="2" fill="#EF4444" />
            <rect x="25" y="38" width="12" height="72" rx="2" fill="#991B1B" />
            <rect x="83" y="38" width="12" height="72" rx="2" fill="#991B1B" />
            <rect x="20" y="55" width="80" height="8" rx="2" fill="#B91C1C" />
          </svg>
        </div>
        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#fbbf24",
            textShadow: "0 0 40px rgba(251,191,36,0.6)",
            letterSpacing: "-2px",
            marginBottom: 16,
          }}
        >
          神社マージ
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontSize: 30,
            color: "#fde68a",
            marginBottom: 40,
            opacity: 0.85,
          }}
        >
          神社を合体させて最強の神社を目指せ！
        </div>
        {/* Shrine levels */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          {["鳥居", "社", "拝殿", "境内社", "大社", "天照"].map((s, i) => (
            <div
              key={i}
              style={{
                fontSize: 20,
                fontWeight: 700,
                background: "rgba(255,200,0,0.1)",
                border: "1px solid rgba(255,200,0,0.3)",
                borderRadius: 12,
                padding: "8px 12px",
                color: "#fde68a",
              }}
            >
              {s}
            </div>
          ))}
        </div>
        {/* Tag */}
        <div
          style={{
            fontSize: 22,
            color: "#92400e",
            background: "rgba(255,200,0,0.08)",
            border: "1px solid rgba(255,200,0,0.2)",
            borderRadius: 100,
            padding: "8px 28px",
          }}
        >
          無料プレイ
        </div>
      </div>
    ),
    { ...size }
  );
}
