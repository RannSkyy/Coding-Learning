export type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

export type BlockType =
  | 'MOVE_FORWARD'
  | 'TURN_LEFT'
  | 'TURN_RIGHT'
  | 'JUMP'
  | 'PICK_STAR'
  | 'REPEAT'
  | 'IF_OBSTACLE'
  | 'IF_STAR';

export interface CodeBlock {
  id: string;
  type: BlockType;
  repeatCount?: number; // for REPEAT block, e.g. 2, 3, 4
  innerBlocks?: CodeBlock[]; // for REPEAT and IF blocks
}

export type CellType =
  | 'EMPTY'       // Green grass or void
  | 'PATH'        // Walkable stone path
  | 'BRIDGE'      // Wooden bridge path
  | 'WATER'       // Water obstacle (walkable only by bridge or jumpable)
  | 'OBSTACLE'    // Bush, rock, tree
  | 'GOAL'        // Finish flag
  | 'STAR';       // Collectible star

export interface GridCell {
  x: number;
  y: number;
  type: CellType;
  hasStar?: boolean;
}

export interface LevelConfig {
  id: number;
  worldId: number;
  worldLevelNumber: number; // 1 to 15 (or 20 in World 5)
  title: string;
  concept: string;
  instructions: string;
  hint: string;
  gridSize: { width: number; height: number };
  startPos: { x: number; y: number };
  startDir: Direction;
  goalPos: { x: number; y: number };
  grid: CellType[][]; // [y][x]
  stars: { x: number; y: number }[];
  optimalBlocks: number; // For 3 stars
  allowedBlocks: BlockType[];
  maxBlocks?: number;
}

export interface WorldConfig {
  id: number;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  conceptTag: string;
  totalLevels: number;
  requiredStarsToUnlock: number;
  themeColor: string;
  bgGradient: string;
  iconName: string;
}

export interface LevelProgress {
  levelId: number;
  stars: number; // 1, 2, 3
  bestBlocksCount: number;
  completed: boolean;
  completedAt?: string;
}

export interface UserProgress {
  playerName: string;
  totalXP: number;
  levelProgress: Record<number, LevelProgress>;
  unlockedWorlds: number[];
  achievements: string[];
  soundEnabled: boolean;
  dailyChallengeCompletedDate?: string;
  lastPlayedLevelId: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  category: 'progress' | 'mastery' | 'challenge';
}

export interface LearningTopic {
  id: string;
  title: string;
  summary: string;
  analogy: string;
  icon: string;
  color: string;
  explanation: string[];
  pseudocodeExample: string;
  blockVisuals: { blockName: string; description: string; color: string }[];
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}
