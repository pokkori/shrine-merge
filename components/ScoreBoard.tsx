"use client";

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  goryakuPoints: number;
}

export default function ScoreBoard({ score, bestScore, goryakuPoints }: ScoreBoardProps) {
  return (
    <div className="flex gap-2 w-full max-w-sm mx-auto">
      <div
        className="flex-1 rounded-xl p-2 text-center"
        style={{
          background: "linear-gradient(135deg,#7f0000,#c0392b)",
          border: "1px solid rgba(212,175,55,0.3)",
          boxShadow: "0 4px 12px rgba(192,57,43,0.4)",
        }}
      >
        <div className="text-[10px] text-red-200 font-bold uppercase tracking-wide">スコア</div>
        <div className="font-black text-lg leading-tight" style={{ color: "#fde68a" }}>
          {score.toLocaleString()}
        </div>
      </div>
      <div
        className="flex-1 rounded-xl p-2 text-center"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(212,175,55,0.3)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wide">ベスト</div>
        <div className="font-black text-lg leading-tight text-white">{bestScore.toLocaleString()}</div>
      </div>
      <div
        className="flex-1 rounded-xl p-2 text-center"
        style={{
          background: "linear-gradient(135deg,#92400e,#d4af37)",
          border: "1px solid rgba(212,175,55,0.5)",
          boxShadow: "0 4px 12px rgba(212,175,55,0.3)",
        }}
      >
        <div className="text-[10px] text-yellow-100 font-bold uppercase tracking-wide">御利益pt</div>
        <div className="font-black text-lg leading-tight text-yellow-900">{goryakuPoints.toLocaleString()}</div>
        <div className="text-[9px] text-yellow-800 leading-tight mt-0.5">おみくじで新しい<br />神社を召喚（50pt）</div>
      </div>
    </div>
  );
}
