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
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 12px rgba(192,57,43,0.4)",
        }}
      >
        <div className="text-[10px] text-slate-200 font-bold uppercase tracking-wide">Score</div>
        <div className="font-black text-lg leading-tight text-slate-100">
          {score.toLocaleString()}
        </div>
      </div>
      <div
        className="flex-1 rounded-xl p-2 text-center"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wide">Best</div>
        <div className="font-black text-lg leading-tight text-slate-100">{bestScore.toLocaleString()}</div>
      </div>
      <div
        className="flex-1 rounded-xl p-2 text-center"
        style={{
          background: "linear-gradient(135deg,#92400e,#d4af37)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 12px rgba(212,175,55,0.3)",
        }}
      >
        <div className="text-[10px] text-slate-100 font-bold uppercase tracking-wide">Goriyaku</div>
        <div className="font-black text-lg leading-tight text-slate-100">{goryakuPoints.toLocaleString()}</div>
        <div className="text-[9px] text-slate-200 leading-tight mt-0.5">omikuji de<br />召喚(50pt)</div>
      </div>
    </div>
  );
}
