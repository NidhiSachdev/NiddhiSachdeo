export const GRID_SIZE = 8;
export const GEM_TYPES = 6;
export const TARGET_SCORE = 1000;
export const MAX_MOVES = 30;

export type GemType = 0 | 1 | 2 | 3 | 4 | 5;

export interface Cell {
  type: GemType;
  id: string;
}

export interface Position {
  row: number;
  col: number;
}

export interface MatchResult {
  positions: Position[];
}

const GEM_COLORS = [
  { emoji: "🔴", color: "from-red-500 to-rose-400", glow: "shadow-red-500/50" },
  { emoji: "🔵", color: "from-blue-500 to-sky-400", glow: "shadow-blue-500/50" },
  { emoji: "🟢", color: "from-green-500 to-emerald-400", glow: "shadow-green-500/50" },
  { emoji: "🟡", color: "from-yellow-500 to-amber-400", glow: "shadow-yellow-500/50" },
  { emoji: "🟣", color: "from-purple-500 to-pink-400", glow: "shadow-purple-500/50" },
  { emoji: "🟠", color: "from-orange-500 to-orange-400", glow: "shadow-orange-500/50" },
] as const;

export function getGemVisual(type: GemType) {
  return GEM_COLORS[type];
}

let idCounter = 0;
function nextId(): string {
  return `gem-${++idCounter}`;
}

export function resetIdCounter() {
  idCounter = 0;
}

function randomGem(): GemType {
  return Math.floor(Math.random() * GEM_TYPES) as GemType;
}

export function createGrid(): Cell[][] {
  resetIdCounter();
  const grid: Cell[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      let type: GemType;
      do {
        type = randomGem();
      } while (wouldCauseMatch(grid, row, r, c, type));
      row.push({ type, id: nextId() });
    }
    grid.push(row);
  }
  return grid;
}

function wouldCauseMatch(
  grid: Cell[][],
  currentRow: Cell[],
  r: number,
  c: number,
  type: GemType
): boolean {
  // Horizontal: check 2 to the left
  if (
    c >= 2 &&
    currentRow[c - 1].type === type &&
    currentRow[c - 2].type === type
  ) {
    return true;
  }
  // Vertical: check 2 above
  if (
    r >= 2 &&
    grid[r - 1][c].type === type &&
    grid[r - 2][c].type === type
  ) {
    return true;
  }
  return false;
}

export function isAdjacent(a: Position, b: Position): boolean {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

export function swapCells(grid: Cell[][], a: Position, b: Position): Cell[][] {
  const newGrid = grid.map((row) => [...row]);
  const temp = newGrid[a.row][a.col];
  newGrid[a.row][a.col] = newGrid[b.row][b.col];
  newGrid[b.row][b.col] = temp;
  return newGrid;
}

export function findMatches(grid: Cell[][]): MatchResult[] {
  const matched = new Set<string>();
  const results: MatchResult[] = [];

  // Horizontal matches
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c <= GRID_SIZE - 3; c++) {
      const type = grid[r][c].type;
      let len = 1;
      while (c + len < GRID_SIZE && grid[r][c + len].type === type) len++;
      if (len >= 3) {
        const positions: Position[] = [];
        for (let i = 0; i < len; i++) {
          const key = `${r},${c + i}`;
          if (!matched.has(key)) {
            matched.add(key);
            positions.push({ row: r, col: c + i });
          }
        }
        if (positions.length > 0) results.push({ positions });
        c += len - 1;
      }
    }
  }

  // Vertical matches
  for (let c = 0; c < GRID_SIZE; c++) {
    for (let r = 0; r <= GRID_SIZE - 3; r++) {
      const type = grid[r][c].type;
      let len = 1;
      while (r + len < GRID_SIZE && grid[r + len][c].type === type) len++;
      if (len >= 3) {
        const positions: Position[] = [];
        for (let i = 0; i < len; i++) {
          const key = `${r + i},${c}`;
          if (!matched.has(key)) {
            matched.add(key);
            positions.push({ row: r + i, col: c });
          }
        }
        if (positions.length > 0) results.push({ positions });
        r += len - 1;
      }
    }
  }

  return results;
}

export function removeMatches(grid: Cell[][], matches: MatchResult[]): Cell[][] {
  const newGrid = grid.map((row) => [...row]);
  for (const match of matches) {
    for (const pos of match.positions) {
      newGrid[pos.row][pos.col] = null as unknown as Cell;
    }
  }
  return newGrid;
}

export function applyGravity(grid: Cell[][]): { grid: Cell[][]; drops: number } {
  const newGrid = grid.map((row) => [...row]);
  let totalDrops = 0;

  for (let c = 0; c < GRID_SIZE; c++) {
    let writePos = GRID_SIZE - 1;
    for (let r = GRID_SIZE - 1; r >= 0; r--) {
      if (newGrid[r][c] !== null) {
        if (writePos !== r) {
          newGrid[writePos][c] = newGrid[r][c];
          newGrid[r][c] = null as unknown as Cell;
          totalDrops++;
        }
        writePos--;
      }
    }
    // Fill empty cells at top with new gems
    for (let r = writePos; r >= 0; r--) {
      newGrid[r][c] = { type: randomGem(), id: nextId() };
      totalDrops++;
    }
  }

  return { grid: newGrid, drops: totalDrops };
}

export function calculateScore(matches: MatchResult[], comboLevel: number): number {
  let score = 0;
  for (const match of matches) {
    const baseScore = match.positions.length * 10;
    const lengthBonus = match.positions.length > 3 ? (match.positions.length - 3) * 15 : 0;
    score += (baseScore + lengthBonus) * (1 + comboLevel * 0.5);
  }
  return Math.round(score);
}

export function hasValidMoves(grid: Cell[][]): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      // Try swap right
      if (c < GRID_SIZE - 1) {
        const swapped = swapCells(grid, { row: r, col: c }, { row: r, col: c + 1 });
        if (findMatches(swapped).length > 0) return true;
      }
      // Try swap down
      if (r < GRID_SIZE - 1) {
        const swapped = swapCells(grid, { row: r, col: c }, { row: r + 1, col: c });
        if (findMatches(swapped).length > 0) return true;
      }
    }
  }
  return false;
}
