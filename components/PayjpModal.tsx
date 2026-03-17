"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Payjp: any;
  }
}

interface Props {
  publicKey: string;
  planLabel: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PayjpModal({
  publicKey,
  planLabel,
  onSuccess,
  onClose,
}: Props) {
  const [cardReady, setCardReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payjpRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cardRef = useRef<any>(null);

  useEffect(() => {
    function initCard() {
      if (!window.Payjp) return;
      const payjp = window.Payjp(publicKey);
      payjpRef.current = payjp;
      const elements = payjp.elements();
      const card = elements.create("card");
      card.mount("#payjp-card-element");
      cardRef.current = card;
      setCardReady(true);
    }

    if (window.Payjp) {
      initCard();
    } else {
      const existing = document.getElementById("payjp-js");
      if (existing) {
        existing.addEventListener("load", initCard);
        return () => existing.removeEventListener("load", initCard);
      }
      const script = document.createElement("script");
      script.id = "payjp-js";
      script.src = "https://js.pay.jp/v2/pay.js";
      script.onload = initCard;
      document.head.appendChild(script);
    }

    return () => {
      cardRef.current?.unmount?.();
    };
  }, [publicKey]);

  const handlePay = async () => {
    if (!payjpRef.current || !cardRef.current) return;
    setLoading(true);
    setError("");
    try {
      const result = await payjpRef.current.createToken(cardRef.current);
      if (result.error) {
        setError(result.error.message ?? "カード情報の取得に失敗しました");
        return;
      }

      const res = await fetch("/api/payjp/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: result.token.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "決済に失敗しました。カード情報をご確認ください。");
        return;
      }
      onSuccess();
    } catch {
      setError("エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
      <div
        className="rounded-2xl p-8 max-w-md w-full shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #1a0a20, #2d1040)",
          border: "1px solid rgba(212,175,55,0.4)",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-amber-200">カード決済</h2>
          <button
            onClick={onClose}
            className="text-amber-400 hover:text-amber-200 text-2xl leading-none font-light"
          >
            x
          </button>
        </div>

        <p className="text-sm text-amber-300 mb-6 rounded-lg px-4 py-3"
          style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
          {planLabel}
        </p>

        <div
          id="payjp-card-element"
          className="rounded-lg p-4 mb-2 min-h-[52px]"
          style={{ background: "#fff", border: "1px solid rgba(212,175,55,0.3)" }}
        />
        {!cardReady && (
          <p className="text-xs text-amber-500 mb-4">カードフォームを読み込み中...</p>
        )}

        {error && (
          <div className="text-red-300 text-sm rounded-lg px-4 py-3 mb-4"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
            {error}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={!cardReady || loading}
          className="w-full font-bold py-3 rounded-xl transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #d4af37, #f59e0b)",
            color: "#1a0a00",
          }}
        >
          {loading ? "処理中..." : "支払う"}
        </button>

        <p className="text-xs text-amber-600 mt-4 text-center">
          カード情報はPAY.JP（PCI DSS準拠）で安全に処理されます。当サービスには保存されません。
        </p>
      </div>
    </div>
  );
}
