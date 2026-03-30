"use client";

import { useState } from "react";

interface Props {
  planId: string;
  planLabel: string;
  className?: string;
}

export default function KomojuButton({ planId, planLabel, className }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/komoju/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("決済の準備中です。しばらくお待ちください。");
        setLoading(false);
      }
    } catch {
      setError("通信エラーが発生しました。再度お試しください。");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        aria-label={loading ? "決済ページへ移動中" : planLabel}
        className={className ?? "w-full font-bold py-3 rounded-xl transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-slate-100"}
        style={{
          background: "linear-gradient(135deg, #d4af37, #f59e0b)",
          color: "#1a0a00",
          boxShadow: "0 0 16px rgba(212,175,55,0.3)",
        }}
      >
        {loading ? "決済ページへ移動中..." : planLabel}
      </button>
      {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
    </div>
  );
}
