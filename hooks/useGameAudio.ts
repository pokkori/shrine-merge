"use client";
import { useEffect, useRef, useState, useCallback } from "react";

// ヨナ抜き長音階 (C D E G A) の MIDI ノート番号
// オクターブ4: C4=60, D4=62, E4=64, G4=67, A4=69
// オクターブ3: C3=48, D3=50, E3=52, G3=55, A3=57

const YONANUKI_SCALE_O4 = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81];
const YONANUKI_SCALE_O3 = [48, 50, 52, 55, 57, 60, 62, 64, 67, 69];

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// ---- BGM スケジューラー ----
// 3声部: メロディ(sine) + ベース(sine) + パーカッション(triangle)
// BPM: 90, 拍子: 4/4

const BPM = 90;
const BEAT_SEC = 60 / BPM; // 約0.667秒/拍
const BAR_SEC = BEAT_SEC * 4; // 1小節

// メロディパターン (YONANUKI_SCALE_O4 のインデックス, -1=休符)
const MELODY_PATTERN: number[] = [
  0, -1, 2, -1, 4, -1, 6, -1, // C E G C(oct)
  5, -1, 3, -1, 1, -1, 0, -1, // A E D C
  4, -1, 6, -1, 5, -1, 3, -1, // G C A E
  2, -1, 0, -1, 1, -1, 4, -1, // D C D G
];

// ベースパターン (YONANUKI_SCALE_O3 のインデックス, -1=休符)
const BASS_PATTERN: number[] = [
  0, -1, -1, -1, 3, -1, -1, -1, // C G
  5, -1, -1, -1, 2, -1, -1, -1, // A E
  0, -1, -1, -1, 3, -1, -1, -1,
  1, -1, -1, -1, 0, -1, -1, -1,
];

// パーカッションパターン (1=ヒット, 0=無音)
const PERC_PATTERN: number[] = [
  1, 0, 0, 0, 1, 0, 1, 0,
  1, 0, 0, 0, 1, 0, 1, 0,
  1, 0, 0, 0, 1, 0, 1, 0,
  1, 0, 0, 0, 1, 0, 1, 0,
];

const PATTERN_STEPS = MELODY_PATTERN.length; // 32ステップ

class BGMScheduler {
  private ctx: AudioContext;
  private masterGain: GainNode;
  private nextStepTime: number = 0;
  private currentStep: number = 0;
  private rafId: number | null = null;
  private running: boolean = false;
  readonly LOOKAHEAD = 0.1; // 100ms先読み
  readonly SCHEDULE_INTERVAL = 50; // 50msごとにスケジュール

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0.35;
    this.masterGain.connect(ctx.destination);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.nextStepTime = this.ctx.currentTime + 0.05;
    this.schedule();
  }

  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  setMuted(muted: boolean) {
    this.masterGain.gain.setTargetAtTime(
      muted ? 0 : 0.35,
      this.ctx.currentTime,
      0.05
    );
  }

  private schedule() {
    if (!this.running) return;

    while (
      this.nextStepTime <
      this.ctx.currentTime + this.LOOKAHEAD
    ) {
      this.scheduleStep(this.currentStep, this.nextStepTime);
      this.nextStepTime += BEAT_SEC / 8; // 32分音符単位 (4/4拍子×8分割)
      this.currentStep = (this.currentStep + 1) % PATTERN_STEPS;
    }

    this.rafId = requestAnimationFrame(() => {
      setTimeout(() => this.schedule(), this.SCHEDULE_INTERVAL);
    });
  }

  private scheduleStep(step: number, time: number) {
    const stepDur = BEAT_SEC / 8;

    // メロディ (sine)
    const melIdx = MELODY_PATTERN[step];
    if (melIdx >= 0) {
      const freq = midiToFreq(YONANUKI_SCALE_O4[melIdx]);
      this.playNote(freq, "sine", 0.25, time, stepDur * 1.8);
    }

    // ベース (sine)
    const bassIdx = BASS_PATTERN[step];
    if (bassIdx >= 0) {
      const freq = midiToFreq(YONANUKI_SCALE_O3[bassIdx]);
      this.playNote(freq, "sine", 0.18, time, stepDur * 3.5);
    }

    // パーカッション (triangle)
    if (PERC_PATTERN[step] === 1) {
      this.playPerc(time);
    }
  }

  private playNote(
    freq: number,
    wave: OscillatorType,
    vol: number,
    time: number,
    dur: number
  ) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = wave;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(this.masterGain);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.start(time);
    osc.stop(time + dur + 0.01);
  }

  private playPerc(time: number) {
    // 打楽器: noise burst + triangle
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noise.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseGain.gain.setValueAtTime(0.12, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    noise.start(time);
    noise.stop(time + 0.08);
  }

  destroy() {
    this.stop();
    this.masterGain.disconnect();
  }
}

// ---- SE 生成 ----

interface SEConfig {
  freqs: number[];
  dur: number;
  wave: OscillatorType;
  vol: number;
  type: "sweep" | "chord" | "descend";
}

const SE_CONFIGS: Record<string, SEConfig> = {
  merge: {
    // 神聖な上昇音 (C E G C)
    freqs: [midiToFreq(60), midiToFreq(64), midiToFreq(67), midiToFreq(72)],
    dur: 0.4,
    wave: "sine",
    vol: 0.55,
    type: "sweep",
  },
  score: {
    // コイン系 短い上昇 (G A C)
    freqs: [midiToFreq(67), midiToFreq(69), midiToFreq(72)],
    dur: 0.2,
    wave: "triangle",
    vol: 0.45,
    type: "sweep",
  },
  levelup: {
    // 明るいファンファーレ (C E G)
    freqs: [midiToFreq(60), midiToFreq(64), midiToFreq(67)],
    dur: 0.5,
    wave: "sine",
    vol: 0.65,
    type: "chord",
  },
  gameover: {
    // 低い下降音 (A G E C)
    freqs: [midiToFreq(57), midiToFreq(55), midiToFreq(52), midiToFreq(48)],
    dur: 0.6,
    wave: "sawtooth",
    vol: 0.5,
    type: "descend",
  },
  omikuji: {
    // ロール感→ピン (高速上昇+最後に短音)
    freqs: [
      midiToFreq(55),
      midiToFreq(57),
      midiToFreq(60),
      midiToFreq(62),
      midiToFreq(64),
      midiToFreq(79),
    ],
    dur: 0.5,
    wave: "sine",
    vol: 0.6,
    type: "sweep",
  },
  button: {
    // UI 軽い短音
    freqs: [midiToFreq(72)],
    dur: 0.06,
    wave: "sine",
    vol: 0.3,
    type: "sweep",
  },
};

function playSEWithContext(ctx: AudioContext, name: string, muted: boolean) {
  if (muted) return;
  const config = SE_CONFIGS[name];
  if (!config) return;

  const masterGain = ctx.createGain();
  masterGain.gain.value = 1.0;
  masterGain.connect(ctx.destination);

  const now = ctx.currentTime;
  const { freqs, dur, wave, vol, type } = config;

  if (type === "chord") {
    // 和音: 全音同時
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = wave;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(masterGain);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol / freqs.length, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.start(now);
      osc.stop(now + dur + 0.02);
    });
  } else if (type === "sweep" || type === "descend") {
    // アルペジオ: 順番に鳴らす
    const interval = dur / freqs.length;
    freqs.forEach((freq, i) => {
      const t = now + i * interval;
      const noteDur = interval * 1.2;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = wave;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(masterGain);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, t + noteDur);
      osc.start(t);
      osc.stop(t + noteDur + 0.02);
    });
  }

  // クリーンアップ
  masterGain.gain.setTargetAtTime(0, now + dur + 0.1, 0.05);
}

// ---- メインフック ----

export function useGameAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const bgmRef = useRef<BGMScheduler | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [bgmStarted, setBgmStarted] = useState(false);
  const isMutedRef = useRef(false);

  // AudioContext の遅延初期化（ブラウザ自動再生ポリシー対応）
  const getOrCreateContext = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  useEffect(() => {
    return () => {
      bgmRef.current?.destroy();
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  const startBGM = useCallback(() => {
    if (bgmStarted) return;
    const ctx = getOrCreateContext();
    const scheduler = new BGMScheduler(ctx);
    scheduler.setMuted(isMutedRef.current);
    scheduler.start();
    bgmRef.current = scheduler;
    setBgmStarted(true);
  }, [bgmStarted, getOrCreateContext]);

  const playSE = useCallback(
    (name: keyof typeof SE_CONFIGS) => {
      if (isMutedRef.current) return;
      const ctx = getOrCreateContext();
      playSEWithContext(ctx, name, isMutedRef.current);
    },
    [getOrCreateContext]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      bgmRef.current?.setMuted(next);
      return next;
    });
  }, []);

  return { startBGM, playSE, toggleMute, isMuted };
}
