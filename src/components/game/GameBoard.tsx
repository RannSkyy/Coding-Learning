import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Direction, CellType } from '../../types';

interface GameBoardProps {
  gridSize: { width: number; height: number };
  grid: CellType[][];
  robotPos: { x: number; y: number };
  robotDir: Direction;
  goalPos: { x: number; y: number };
  stars: { x: number; y: number }[];
  collectedStars: { x: number; y: number }[];
  visitedCells: { x: number; y: number }[];
  isExecuting: boolean;
  robotStatus: 'idle' | 'walking' | 'jumping' | 'collecting' | 'error' | 'victory';
  statusMessage?: string;
  themeWorldId?: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gridSize,
  grid,
  robotPos,
  robotDir,
  goalPos,
  stars,
  collectedStars,
  visitedCells,
  isExecuting,
  robotStatus,
  statusMessage,
  themeWorldId = 1,
}) => {
  // Convert direction to rotation degrees
  const getRotationDegree = (dir: Direction): number => {
    switch (dir) {
      case 'UP':
        return 0;
      case 'RIGHT':
        return 90;
      case 'DOWN':
        return 180;
      case 'LEFT':
        return 270;
    }
  };

  const isStarCollected = (x: number, y: number) => {
    return collectedStars.some((s) => s.x === x && s.y === y);
  };

  const isCellVisited = (x: number, y: number) => {
    return visitedCells.some((c) => c.x === x && c.y === y);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-5 select-none overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 via-emerald-50 to-teal-100 border border-emerald-200/80 shadow-inner">
      {/* Background scenery details */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Decorative top scenery cloud & foliage accents */}
      <div className="absolute top-2 left-4 text-emerald-800/40 text-xs font-semibold flex items-center gap-2 pointer-events-none">
        <span>🌱 Dunia Petualangan</span>
        <span>·</span>
        <span>Ukuran: {gridSize.width} × {gridSize.height}</span>
      </div>

      {/* Grid Arena Container */}
      <div
        className="relative z-10 grid gap-1.5 sm:gap-2 p-2.5 sm:p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-white/80 shadow-md transition-all duration-300 max-w-full max-h-[520px] aspect-square flex items-center justify-center"
        style={{
          gridTemplateColumns: `repeat(${gridSize.width}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSize.height}, minmax(0, 1fr))`,
          width: `${Math.min(gridSize.width * 70, 480)}px`,
          height: `${Math.min(gridSize.height * 70, 480)}px`,
        }}
      >
        {/* Render each grid cell */}
        {grid.map((row, y) =>
          row.map((cellType, x) => {
            const isGoal = goalPos.x === x && goalPos.y === y;
            const hasStar =
              stars.some((s) => s.x === x && s.y === y) && !isStarCollected(x, y);
            const isVisited = isCellVisited(x, y);
            const isRobotHere = robotPos.x === x && robotPos.y === y;

            return (
              <div
                key={`${x}-${y}`}
                className="relative flex items-center justify-center rounded-xl transition-all duration-200 overflow-visible group"
                style={{
                  backgroundColor:
                    cellType === 'PATH'
                      ? '#FEF3C7'
                      : cellType === 'BRIDGE'
                      ? '#FDE68A'
                      : cellType === 'WATER'
                      ? '#BAE6FD'
                      : cellType === 'OBSTACLE'
                      ? '#E2E8F0'
                      : '#DCFCE7', // Lush grass
                  border:
                    cellType === 'PATH'
                      ? '2px solid #FCD34D'
                      : cellType === 'BRIDGE'
                      ? '2px solid #D97706'
                      : cellType === 'WATER'
                      ? '2px dashed #0284C7'
                      : cellType === 'OBSTACLE'
                      ? '2px solid #94A3B8'
                      : '2px solid #BBF7D0',
                }}
              >
                {/* Visual texture inside cells */}
                {cellType === 'PATH' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-60">
                    <span className="text-[10px] text-amber-700/60 font-mono">::</span>
                  </div>
                )}

                {cellType === 'BRIDGE' && (
                  <div className="w-full h-full flex flex-col justify-around py-1 px-0.5 opacity-80">
                    <div className="h-0.5 bg-amber-800/40 rounded-full" />
                    <div className="h-0.5 bg-amber-800/40 rounded-full" />
                    <div className="h-0.5 bg-amber-800/40 rounded-full" />
                  </div>
                )}

                {cellType === 'WATER' && (
                  <div className="text-sky-500 font-bold text-xs animate-pulse opacity-70">
                    〰〰
                  </div>
                )}

                {cellType === 'OBSTACLE' && (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xl sm:text-2xl filter drop-shadow-xs">🪨</span>
                  </div>
                )}

                {/* Footsteps trail on visited path */}
                {isVisited && !isRobotHere && cellType !== 'OBSTACLE' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 text-[11px] font-bold text-amber-800">
                    🐾
                  </div>
                )}

                {/* Star on tile */}
                {hasStar && (
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="relative z-10 flex items-center justify-center"
                  >
                    <span className="text-2xl sm:text-3xl filter drop-shadow-md">⭐</span>
                  </motion.div>
                )}

                {/* Goal Flag */}
                {isGoal && (
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-2xl sm:text-3xl filter drop-shadow-md"
                    >
                      🏁
                    </motion.div>
                  </div>
                )}

                {/* Coordinates label (subtle) */}
                <span className="absolute bottom-0.5 right-1 text-[9px] text-slate-400/60 font-mono pointer-events-none">
                  {x},{y}
                </span>
              </div>
            );
          })
        )}

        {/* Animated Robot Character Mascot overlay on the grid */}
        <motion.div
          className="absolute z-20 pointer-events-none flex items-center justify-center"
          animate={{
            left: `${(robotPos.x / gridSize.width) * 100}%`,
            top: `${(robotPos.y / gridSize.height) * 100}%`,
            width: `${100 / gridSize.width}%`,
            height: `${100 / gridSize.height}%`,
            scale: robotStatus === 'jumping' ? 1.3 : robotStatus === 'victory' ? [1, 1.15, 1] : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 24,
            mass: 0.8,
          }}
        >
          <div className="relative w-10 h-10 sm:w-13 sm:h-13 flex items-center justify-center">
            {/* Pulsing base shadow */}
            <div className="absolute bottom-0 w-8 h-2.5 bg-slate-800/20 rounded-full blur-xs" />

            {/* Robot body with directional rotation */}
            <motion.div
              className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-blue-400 border-2 border-white shadow-lg flex items-center justify-center"
              animate={{
                rotate: getRotationDegree(robotDir),
              }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 22,
              }}
            >
              {/* Explorer Hat badge */}
              <div className="absolute -top-1.5 w-5 h-2 bg-amber-500 rounded-sm border border-amber-600 shadow-xs" />
              
              {/* Robot Face Display */}
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900 border border-sky-300 flex items-center justify-center gap-1">
                {/* Glowing Eyes */}
                <div className={`w-1.5 h-2 rounded-full ${robotStatus === 'error' ? 'bg-red-400' : 'bg-amber-300'} shadow-[0_0_6px_#fde047]`} />
                <div className={`w-1.5 h-2 rounded-full ${robotStatus === 'error' ? 'bg-red-400' : 'bg-amber-300'} shadow-[0_0_6px_#fde047]`} />
              </div>

              {/* Direction Pointer Arrow on head */}
              <div className="absolute -top-2.5 text-blue-600 text-xs font-black filter drop-shadow-xs">
                ▲
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Speech message overlay when robot reacts */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-3 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 border ${
              robotStatus === 'error'
                ? 'bg-red-50 text-red-700 border-red-200'
                : robotStatus === 'victory'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-white text-slate-800 border-slate-200'
            }`}
          >
            <span>{robotStatus === 'error' ? '⚠️' : robotStatus === 'victory' ? '🎉' : '🤖'}</span>
            <span>{statusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
