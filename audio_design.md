# 神社マージ オーディオ設計書

## BGM

- ファイル: /public/audio/bgm_main.mp3
- ループ: true
- 音量: 0.35（デフォルト）
- フェードイン: 2秒

### 調達方法（優先順）

1. **Suno AI生成**（推奨・下記プロンプト参照）
2. フリー音源フォールバック: Freesound.org CC0 — Pixabay Music の "Japanese" カテゴリ検索（要ログイン不要でDL可）

---

## SE一覧

| ファイル名 | タイミング | 音量 | 調達元 |
|---|---|---|---|
| se_merge.mp3 | マージ成功時 | 0.8 | Freesound ID 739753 (Vrymaa) CC0 |
| se_score.mp3 | スコア加算時 | 0.5 | Freesound ID 538146 (Fupicat) CC0 |
| se_levelup.mp3 | level6以上のマージ | 1.0 | Freesound ID 449946 (steffcaffrey) CC0 |
| se_gameover.mp3 | ゲームオーバー時 | 0.7 | Freesound ID 173859 (jivatma07) CC0 |
| se_omikuji.mp3 | おみくじ発動時 | 0.8 | Freesound ID 739753 (Vrymaa) CC0 ＋ピッチ変換 |
| se_button.mp3 | ボタンタップ時 | 0.4 | Freesound ID 218460 (thomasjaunism) CC0 |

---

## 確認済みCC0音源リスト

| SE用途 | Freesound ID | ファイル名 | クリエイター | ライセンス | URL |
|---|---|---|---|---|---|
| merge_success | 739753 | bell-japanese-small.wav | Vrymaa | CC0 | https://freesound.org/people/Vrymaa/sounds/739753/ |
| score_add | 538146 | plingy-coin.wav | Fupicat | CC0 | https://freesound.org/people/Fupicat/sounds/538146/ |
| level_up | 449946 | single-chime.wav | steffcaffrey | CC0 | https://freesound.org/people/steffcaffrey/sounds/449946/ |
| game_over | 173859 | j1game_over_mono.wav | jivatma07 | CC0 | https://freesound.org/people/jivatma07/sounds/173859/ |
| button | 218460 | wood-block-hit.wav | thomasjaunism | CC0 | https://freesound.org/people/thomasjaunism/sounds/218460/ |

> ダウンロード手順: 各URLにアクセス → Freesoundアカウントでログイン → Downloadボタンでwav取得 → ffmpegでmp3変換
> ffmpeg -i input.wav -codec:a libmp3lame -qscale:a 2 output.mp3

---

## Web Audio API実装パターン

```typescript
// hooks/useGameAudio.ts
export function useGameAudio() {
  const startBGM = () => { ... }
  const playSE = (name: string) => { ... }
  const toggleMute = () => { ... }
  return { startBGM, playSE, toggleMute, isMuted }
}
```

---

## Suno AIプロンプト（BGM生成用）

### メインBGM

Style: Japanese traditional, peaceful, loop-friendly
Instruments: koto, shakuhachi, soft percussion
Mood: zen, meditative, slightly mystical
Length: 60-90 seconds (for looping)
No lyrics

Prompt:
"serene japanese shrine atmosphere, koto melody, shakuhachi flute,
soft taiko rhythm, peaceful and meditative, perfect loop, no vocals,
ambient japanese traditional music"

### Suno AI使用手順

1. https://suno.com にアクセス
2. "Create" → Custom Mode をON
3. 上記プロンプトを "Style of Music" 欄に貼り付け
4. Lyrics欄は空白（Instrumental にチェック）
5. 生成後 → 右クリックでmp3ダウンロード → /public/audio/bgm_main.mp3 に配置

---

## ライセンスまとめ

| 種別 | 音源名 | ライセンス | 帰属表示要否 |
|---|---|---|---|
| BGM | Suno AI生成 or 自作 | Suno利用規約 / 自作=フリー | Sunoの場合は規約確認 |
| SE(merge) | Bell - Japanese, small (Vrymaa) | CC0 | 不要 |
| SE(score) | Plingy Coin (Fupicat) | CC0 | 不要 |
| SE(levelup) | Single Chime (steffcaffrey) | CC0 | 不要 |
| SE(gameover) | j1game_over_mono (jivatma07) | CC0 | 不要 |
| SE(button) | Wood block hit (thomasjaunism) | CC0 | 不要 |

SE 5種すべてCC0のため、クレジット表記なしで商用利用可能。
