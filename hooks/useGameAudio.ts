"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const SE_FILES: Record<string, string> = {
  merge: "/audio/se_merge.mp3",
  score: "/audio/se_score.mp3",
  levelup: "/audio/se_levelup.mp3",
  gameover: "/audio/se_gameover.mp3",
  omikuji: "/audio/se_omikuji.mp3",
  button: "/audio/se_button.mp3",
};

const SE_VOLUMES: Record<string, number> = {
  merge: 0.8,
  score: 0.5,
  levelup: 1.0,
  gameover: 0.7,
  omikuji: 0.8,
  button: 0.4,
};

export function useGameAudio() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [bgmStarted, setBgmStarted] = useState(false);

  useEffect(() => {
    const bgm = new Audio("/audio/bgm_main.mp3");
    bgm.loop = true;
    bgm.volume = 0.35;
    bgmRef.current = bgm;
    return () => {
      bgm.pause();
      bgm.src = "";
    };
  }, []);

  const startBGM = useCallback(() => {
    if (!bgmStarted && bgmRef.current && !isMuted) {
      bgmRef.current.play().catch(() => {});
      setBgmStarted(true);
    }
  }, [bgmStarted, isMuted]);

  const playSE = useCallback(
    (name: keyof typeof SE_FILES) => {
      if (isMuted) return;
      const src = SE_FILES[name];
      if (!src) return;
      const audio = new Audio(src);
      audio.volume = SE_VOLUMES[name] ?? 0.7;
      audio.play().catch(() => {});
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (bgmRef.current) {
        bgmRef.current.muted = next;
      }
      return next;
    });
  }, []);

  return { startBGM, playSE, toggleMute, isMuted };
}
