export interface Shrine {
  level: number;
  name: string;
  emoji: string;
  score: number;
  color: string;
  bgColor: string;
  goryaku: string;
}

export const SHRINES: Shrine[] = [
  { level: 1, name: "鳥居",     emoji: "⛩️",  score: 2,    color: "#ffffff", bgColor: "#ef4444", goryaku: "縁結び" },
  { level: 2, name: "狛犬",     emoji: "🦁",  score: 4,    color: "#ffffff", bgColor: "#f97316", goryaku: "魔除け" },
  { level: 3, name: "手水舎",   emoji: "💧",  score: 8,    color: "#1a1a1a", bgColor: "#fbbf24", goryaku: "浄化" },
  { level: 4, name: "拝殿",     emoji: "🏯",  score: 16,   color: "#ffffff", bgColor: "#22c55e", goryaku: "開運" },
  { level: 5, name: "本殿",     emoji: "🎋",  score: 32,   color: "#ffffff", bgColor: "#06b6d4", goryaku: "健康" },
  { level: 6, name: "神宮",     emoji: "🌸",  score: 64,   color: "#ffffff", bgColor: "#8b5cf6", goryaku: "金運" },
  { level: 7, name: "大社",     emoji: "☀️",  score: 128,  color: "#1a1a1a", bgColor: "#f59e0b", goryaku: "出世" },
  { level: 8, name: "総本社",   emoji: "🌟",  score: 256,  color: "#1a1a1a", bgColor: "#fcd34d", goryaku: "万能" },
  { level: 9, name: "天照大神", emoji: "✨",  score: 512,  color: "#1a1a1a", bgColor: "#fffbeb", goryaku: "最強" },
];

export interface Cell {
  id: number;
  level: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export type Grid = (Cell | null)[][];

export interface GameState {
  grid: Grid;
  score: number;
  bestScore: number;
  goryakuPoints: number;
  isGameOver: boolean;
  highestLevel: number;
  nextId: number;
}

const GRID_SIZE = 4;
const OMIKUJI_COST = 50;
let idCounter = 1;

function newCell(level: number): Cell {
  return { id: idCounter++, level, isNew: true };
}

export function createEmptyGrid(): Grid {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
}

export function addRandomCell(grid: Grid): Grid {
  const emptyCells: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c]) emptyCells.push([r, c]);
    }
  }
  if (emptyCells.length === 0) return grid;
  const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map(row => [...row]);
  // 90% level 1, 10% level 2
  const level = Math.random() < 0.9 ? 1 : 2;
  newGrid[r][c] = newCell(level);
  return newGrid;
}

export function initGame(existingBest = 0): GameState {
  idCounter = 1;
  let grid = createEmptyGrid();
  grid = addRandomCell(grid);
  grid = addRandomCell(grid);
  return {
    grid,
    score: 0,
    bestScore: existingBest,
    goryakuPoints: 0,
    isGameOver: false,
    highestLevel: 1,
    nextId: idCounter,
  };
}

function slideRow(row: (Cell | null)[]): { row: (Cell | null)[], scoreGained: number, highestMerged: number } {
  // Remove nulls
  const cells = row.filter((c): c is Cell => c !== null);
  const merged: (Cell | null)[] = [];
  let scoreGained = 0;
  let highestMerged = 0;
  let i = 0;
  while (i < cells.length) {
    if (i + 1 < cells.length && cells[i].level === cells[i + 1].level) {
      const newLevel = Math.min(cells[i].level + 1, SHRINES.length);
      const shrine = SHRINES[newLevel - 1];
      scoreGained += shrine.score;
      if (newLevel > highestMerged) highestMerged = newLevel;
      merged.push({ id: idCounter++, level: newLevel, isMerged: true });
      i += 2;
    } else {
      merged.push({ ...cells[i], isNew: false, isMerged: false });
      i++;
    }
  }
  // Pad with nulls
  while (merged.length < GRID_SIZE) merged.push(null);
  return { row: merged, scoreGained, highestMerged };
}

function transposeGrid(grid: Grid): Grid {
  const newGrid = createEmptyGrid();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[c][r] = grid[r][c];
    }
  }
  return newGrid;
}

function reverseRows(grid: Grid): Grid {
  return grid.map(row => [...row].reverse());
}

export type Direction = "left" | "right" | "up" | "down";

export function moveGrid(
  grid: Grid,
  direction: Direction
): { grid: Grid; scoreGained: number; moved: boolean; highestMerged: number } {
  let workGrid = grid.map(row => [...row]);
  let totalScore = 0;
  let highestMerged = 0;

  // Normalize: always slide left
  if (direction === "right") workGrid = reverseRows(workGrid);
  if (direction === "up") workGrid = transposeGrid(workGrid);
  if (direction === "down") {
    workGrid = transposeGrid(workGrid);
    workGrid = reverseRows(workGrid);
  }

  const newRows: (Cell | null)[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const { row, scoreGained, highestMerged: hm } = slideRow(workGrid[r]);
    newRows.push(row);
    totalScore += scoreGained;
    if (hm > highestMerged) highestMerged = hm;
  }
  workGrid = newRows;

  // De-normalize
  if (direction === "right") workGrid = reverseRows(workGrid);
  if (direction === "up") workGrid = transposeGrid(workGrid);
  if (direction === "down") {
    workGrid = reverseRows(workGrid);
    workGrid = transposeGrid(workGrid);
  }

  // Check if anything moved
  const moved = JSON.stringify(workGrid.map(r => r.map(c => c?.level ?? 0))) !==
    JSON.stringify(grid.map(r => r.map(c => c?.level ?? 0)));

  return { grid: workGrid, scoreGained: totalScore, moved, highestMerged };
}

export function canMove(grid: Grid): boolean {
  // Check empty cells
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c]) return true;
    }
  }
  // Check mergeable
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = grid[r][c];
      if (!cell) continue;
      if (c + 1 < GRID_SIZE && grid[r][c + 1]?.level === cell.level) return true;
      if (r + 1 < GRID_SIZE && grid[r + 1][c]?.level === cell.level) return true;
    }
  }
  return false;
}

export function getHighestLevel(grid: Grid): number {
  let max = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = grid[r][c];
      if (cell && cell.level > max) max = cell.level;
    }
  }
  return max;
}

export function loadBestScore(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("shrine-merge-best") ?? "0", 10);
}

export function saveBestScore(score: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("shrine-merge-best", String(score));
}

export function calcGoryakuGain(grid: Grid): number {
  let total = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = grid[r][c];
      if (cell) total += cell.level * 10;
    }
  }
  return total;
}

export { OMIKUJI_COST };
