'use client';
import { useEffect, useRef } from 'react';

export interface ScorePopItem {
  id: number;
  value: number;
  combo: number;
  x: number;
  y: number;
}

interface ScorePopLayerProps {
  items: ScorePopItem[];
  onRemove: (id: number) => void;
}

export function ScorePopLayer({ items, onRemove }: ScorePopLayerProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      {items.map(item => (
        <ScorePopBubble key={item.id} item={item} onDone={() => onRemove(item.id)} />
      ))}
    </div>
  );
}

function ScorePopBubble({ item, onDone }: { item: ScorePopItem; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  const isAmaterasu = item.combo >= 9;
  const isHighMerge = item.combo >= 5;
  const fontSize = isAmaterasu ? '2rem' : isHighMerge ? '1.5rem' : '1.1rem';
  const color = isAmaterasu ? '#fffbeb' : isHighMerge ? '#d4af37' : '#f3f0e8';
  const text = isAmaterasu
    ? `天照！ +${item.value}`
    : isHighMerge
    ? `御利益UP +${item.value}`
    : `+${item.value}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const anim = el.animate(
      [
        { transform: 'translate(-50%, 0) scale(0.5)', opacity: '1' },
        { transform: 'translate(-50%, -30px) scale(1.2)', opacity: '1', offset: 0.2 },
        { transform: 'translate(-50%, -80px) scale(1)', opacity: '0' },
      ],
      { duration: 900, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
    );
    anim.onfinish = onDone;
    return () => anim.cancel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        fontSize,
        color,
        fontWeight: 900,
        textShadow: `0 0 12px ${color}, 0 0 24px rgba(212,175,55,0.6), 0 2px 4px rgba(0,0,0,0.8)`,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        fontFamily: '"Noto Serif JP", serif',
      }}
    >
      {text}
    </div>
  );
}
