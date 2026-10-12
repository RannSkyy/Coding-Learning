import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Gauge,
  HelpCircle,
  Sparkles,
  Award,
} from 'lucide-react';
import {
  LevelConfig,
  CodeBlock,
  BlockType,
  Direction,
  UserProgress,
} from '../types';
import { getLevelById, ALL_LEVELS } from '../data/levels';
import { WORLDS } from '../data/worlds';
import { sound } from '../services/sound';
import { StorageService } from '../services/storage';
import { GameBoard } from '../components/game/GameBoard';
import { Workspace } from '../components/game/Workspace';
import { Toolbox } from '../components/game/Toolbox';
import { VictoryModal } from '../components/game/VictoryModal';
import { HintModal } from '../components/game/HintModal';

interface GamePlayProps {
  levelId: number;
  progress: UserProgress;
  onBackToLevels: () => void;
  onNextLevel: (nextId: number) => void;
  onRefreshProgress: () => void;
}

export const GamePlay: React.FC<GamePlayProps> = ({
  levelId,
  progress,
  onBackToLevels,
  onNextLevel,
  onRefreshProgress,
}) => {
  const level = getLevelById(levelId) || ALL_LEVELS[0];
  const world = WORLDS.find((w) => w.id === level.worldId) || WORLDS[0];

  // Game state
  const [robotPos, setRobotPos] = useState<{ x: number; y: number }>(level.startPos);
  const [robotDir, setRobotDir] = useState<Direction>(level.startDir);
  const [collectedStars, setCollectedStars] = useState<{ x: number; y: number }[]>([]);
  const [visitedCells, setVisitedCells] = useState<{ x: number; y: number }[]>([level.startPos]);
  const [robotStatus, setRobotStatus] = useState<
    'idle' | 'walking' | 'jumping' | 'collecting' | 'error' | 'victory'
  >('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Execution state
  const [blocks, setBlocks] = useState<CodeBlock[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionSpeed, setExecutionSpeed] = useState<number>(450); // ms per step
  const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);
  const [activeSubBlockIndex, setActiveSubBlockIndex] = useState<{
    parentIndex: number;
    subIndex: number;
  } | null>(null);

  // Modals
  const [hintOpen, setHintOpen] = useState<boolean>(false);
  const [victoryOpen, setVictoryOpen] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [earnedXP, setEarnedXP] = useState<number>(100);

  // Execution abort ref
  const abortExecutionRef = useRef<boolean>(false);

  // Reset state when level changes
  useEffect(() => {
    resetGame();
    // Default starter block if appropriate
    setBlocks([
      { id: `${Date.now()}-1`, type: 'MOVE_FORWARD' }
    ]);
  }, [levelId]);

  const resetGame = () => {
    abortExecutionRef.current = true;
    setIsExecuting(false);
    setActiveBlockIndex(null);
    setActiveSubBlockIndex(null);
    setRobotPos(level.startPos);
    setRobotDir(level.startDir);
    setCollectedStars([]);
    setVisitedCells([level.startPos]);
    setRobotStatus('idle');
    setStatusMessage('');
  };

  const handleAddBlock = (type: BlockType) => {
    if (isExecuting) return;
    const newBlock: CodeBlock = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      repeatCount: type === 'REPEAT' ? 3 : undefined,
      innerBlocks:
        type === 'REPEAT' || type === 'IF_OBSTACLE' || type === 'IF_STAR'
          ? [{ id: `${Date.now()}-sub`, type: 'MOVE_FORWARD' }]
          : undefined,
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const getFacingCoord = (
    pos: { x: number; y: number },
    dir: Direction,
    distance = 1
  ): { x: number; y: number } => {
    switch (dir) {
      case 'UP':
        return { x: pos.x, y: pos.y - distance };
      case 'RIGHT':
        return { x: pos.x + distance, y: pos.y };
      case 'DOWN':
        return { x: pos.x, y: pos.y + distance };
      case 'LEFT':
        return { x: pos.x - distance, y: pos.y };
    }
  };

  const getTurnDir = (current: Direction, turn: 'LEFT' | 'RIGHT'): Direction => {
    const clockwise: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
    const idx = clockwise.indexOf(current);
    if (turn === 'RIGHT') {
      return clockwise[(idx + 1) % 4];
    } else {
      return clockwise[(idx + 3) % 4];
    }
  };

  // Run interpreter
  const runProgram = async () => {
    if (isExecuting) {
      // Pause / Stop execution
      abortExecutionRef.current = true;
      setIsExecuting(false);
      return;
    }

    if (blocks.length === 0) {
      sound.playError();
      setStatusMessage('Belum ada blok instruksi di catatan!');
      setRobotStatus('error');
      return;
    }

    // Reset initial run state
    abortExecutionRef.current = false;
    setIsExecuting(true);
    setRobotPos(level.startPos);
    setRobotDir(level.startDir);
    setCollectedStars([]);
    setVisitedCells([level.startPos]);
    setRobotStatus('idle');
    setStatusMessage('Robot Kiko mulai menjalankan perintah...');

    let curPos = { ...level.startPos };
    let curDir = level.startDir;
    let curStars: { x: number; y: number }[] = [];
    let curVisited = [{ ...level.startPos }];

    // Step executor helper
    const executeAction = async (type: BlockType): Promise<boolean> => {
      if (abortExecutionRef.current) return false;

      if (type === 'MOVE_FORWARD') {
        const next = getFacingCoord(curPos, curDir, 1);
        // Boundary check
        if (
          next.x < 0 ||
          next.x >= level.gridSize.width ||
          next.y < 0 ||
          next.y >= level.gridSize.height
        ) {
          sound.playError();
          setRobotStatus('error');
          setStatusMessage('Aduh! Kiko melangkah keluar dari peta!');
          return false;
        }

        const cellType = level.grid[next.y][next.x];
        if (cellType === 'OBSTACLE') {
          sound.playError();
          setRobotStatus('error');
          setStatusMessage('Oops! Di depan ada rintangan batu!');
          return false;
        }
        if (cellType === 'WATER') {
          sound.playError();
          setRobotStatus('error');
          setStatusMessage('Aduh! Kiko tercebur ke air!');
          return false;
        }

        // Valid move
        curPos = next;
        setRobotPos(curPos);
        curVisited = [...curVisited, curPos];
        setVisitedCells(curVisited);
        sound.playStep();
        setRobotStatus('walking');
        await sleep(executionSpeed);
        return true;
      }

      if (type === 'TURN_LEFT') {
        curDir = getTurnDir(curDir, 'LEFT');
        setRobotDir(curDir);
        sound.playClick();
        await sleep(executionSpeed);
        return true;
      }

      if (type === 'TURN_RIGHT') {
        curDir = getTurnDir(curDir, 'RIGHT');
        setRobotDir(curDir);
        sound.playClick();
        await sleep(executionSpeed);
        return true;
      }

      if (type === 'JUMP') {
        const landing = getFacingCoord(curPos, curDir, 2);
        // Boundary check for jump landing
        if (
          landing.x < 0 ||
          landing.x >= level.gridSize.width ||
          landing.y < 0 ||
          landing.y >= level.gridSize.height
        ) {
          sound.playError();
          setRobotStatus('error');
          setStatusMessage('Lompatan Kiko mendarat di luar batas peta!');
          return false;
        }

        const landingCell = level.grid[landing.y][landing.x];
        if (landingCell === 'OBSTACLE' || landingCell === 'WATER') {
          sound.playError();
          setRobotStatus('error');
          setStatusMessage('Lompatan Kiko mendarat tepat di atas rintangan!');
          return false;
        }

        curPos = landing;
        setRobotPos(curPos);
        curVisited = [...curVisited, curPos];
        setVisitedCells(curVisited);
        sound.playJump();
        setRobotStatus('jumping');
        await sleep(executionSpeed * 1.2);
        setRobotStatus('idle');
        return true;
      }

      if (type === 'PICK_STAR') {
        const starHere = level.stars.find(
          (s) => s.x === curPos.x && s.y === curPos.y
        );
        const alreadyCollected = curStars.some(
          (s) => s.x === curPos.x && s.y === curPos.y
        );

        if (starHere && !alreadyCollected) {
          curStars = [...curStars, starHere];
          setCollectedStars(curStars);
          sound.playCollect();
          setRobotStatus('collecting');
          setStatusMessage('Bintang berhasil diambil! ⭐');
          await sleep(executionSpeed);
          setRobotStatus('idle');
        } else {
          setStatusMessage('Tidak ada bintang di petak ini.');
          await sleep(executionSpeed * 0.8);
        }
        return true;
      }

      return true;
    };

    // Sequential interpretation loop
    for (let i = 0; i < blocks.length; i++) {
      if (abortExecutionRef.current) break;
      setActiveBlockIndex(i);
      setActiveSubBlockIndex(null);

      const block = blocks[i];

      if (block.type === 'REPEAT') {
        const count = block.repeatCount || 2;
        const inners = block.innerBlocks || [];
        let loopSuccess = true;

        for (let r = 0; r < count; r++) {
          if (abortExecutionRef.current) break;
          for (let sIdx = 0; sIdx < inners.length; sIdx++) {
            if (abortExecutionRef.current) break;
            setActiveSubBlockIndex({ parentIndex: i, subIndex: sIdx });
            const ok = await executeAction(inners[sIdx].type);
            if (!ok) {
              loopSuccess = false;
              break;
            }
          }
          if (!loopSuccess) break;
        }
        if (!loopSuccess) {
          setIsExecuting(false);
          return;
        }
      } else if (block.type === 'IF_OBSTACLE') {
        const front = getFacingCoord(curPos, curDir, 1);
        const hasObstacle =
          front.x < 0 ||
          front.x >= level.gridSize.width ||
          front.y < 0 ||
          front.y >= level.gridSize.height ||
          level.grid[front.y][front.x] === 'OBSTACLE' ||
          level.grid[front.y][front.x] === 'WATER';

        if (hasObstacle) {
          const inners = block.innerBlocks || [];
          for (let sIdx = 0; sIdx < inners.length; sIdx++) {
            if (abortExecutionRef.current) break;
            setActiveSubBlockIndex({ parentIndex: i, subIndex: sIdx });
            const ok = await executeAction(inners[sIdx].type);
            if (!ok) {
              setIsExecuting(false);
              return;
            }
          }
        }
      } else if (block.type === 'IF_STAR') {
        const isAtStar = level.stars.some(
          (s) => s.x === curPos.x && s.y === curPos.y
        );
        if (isAtStar) {
          const inners = block.innerBlocks || [];
          for (let sIdx = 0; sIdx < inners.length; sIdx++) {
            if (abortExecutionRef.current) break;
            setActiveSubBlockIndex({ parentIndex: i, subIndex: sIdx });
            const ok = await executeAction(inners[sIdx].type);
            if (!ok) {
              setIsExecuting(false);
              return;
            }
          }
        }
      } else {
        const ok = await executeAction(block.type);
        if (!ok) {
          setIsExecuting(false);
          return;
        }
      }
    }

    setActiveBlockIndex(null);
    setActiveSubBlockIndex(null);
    setIsExecuting(false);

    // Check Victory Condition
    const isAtGoal =
      curPos.x === level.goalPos.x && curPos.y === level.goalPos.y;
    const collectedAllStars =
      level.stars.length === 0 ||
      curStars.length >= level.stars.length;

    if (isAtGoal && collectedAllStars) {
      setRobotStatus('victory');
      setStatusMessage('Hore! Robot Kiko sampai di bendera kemenangan! 🎉');

      // Calculate Stars rating based on blocks count
      let stars = 1;
      if (blocks.length <= level.optimalBlocks) {
        stars = 3;
      } else if (blocks.length <= level.optimalBlocks + 3) {
        stars = 2;
      }

      const xp = stars * 100;
      setEarnedStars(stars);
      setEarnedXP(xp);

      // Save progress to local storage
      StorageService.updateLevelResult(level.id, stars, blocks.length, xp);
      onRefreshProgress();

      // Open victory modal
      setVictoryOpen(true);
    } else if (isAtGoal && !collectedAllStars) {
      sound.playError();
      setRobotStatus('error');
      setStatusMessage(
        `Kiko sampai di bendera, tapi baru mengumpulkan ${curStars.length} dari ${level.stars.length} bintang!`
      );
    } else {
      setStatusMessage('Instruksi selesai, tetapi Kiko belum mencapai bendera.');
    }
  };

  const hasNextLevel = level.id < 80;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-4">
      {/* Top HUD Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Back and Level Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBackToLevels();
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Kembali ke Daftar Level"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>{world.name}</span>
              <span>·</span>
              <span className="text-blue-600 font-bold">Level {level.id} / 80</span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-slate-900 font-display">
              {level.title}
            </h1>
          </div>
        </div>

        {/* Center Instructions Prompt */}
        <div className="hidden lg:block max-w-md text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 truncate">
          <strong>Misi:</strong> {level.instructions}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Hint button */}
          <button
            onClick={() => {
              sound.playClick();
              setHintOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
            <span className="hidden sm:inline">Petunjuk</span>
          </button>

          {/* Reset button */}
          <button
            onClick={() => {
              sound.playClick();
              resetGame();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Speed Selector */}
          <button
            onClick={() => {
              sound.playClick();
              setExecutionSpeed((prev) => (prev === 450 ? 220 : prev === 220 ? 800 : 450));
            }}
            title="Ubah Kecepatan Eksekusi"
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">
              {executionSpeed === 220 ? '2x' : executionSpeed === 450 ? '1x' : '0.5x'}
            </span>
          </button>

          {/* Primary RUN Button */}
          <button
            onClick={runProgram}
            className={`px-5 py-2 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              isExecuting
                ? 'bg-rose-600 hover:bg-rose-700 ring-2 ring-rose-400/50'
                : 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-400/30'
            }`}
          >
            {isExecuting ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Jalankan (RUN)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 3-Column / Responsive 2-Row Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[560px]">
        {/* Left Column: Game Board Canvas */}
        <div className="lg:col-span-5 h-[420px] sm:h-[480px] lg:h-full">
          <GameBoard
            gridSize={level.gridSize}
            grid={level.grid}
            robotPos={robotPos}
            robotDir={robotDir}
            goalPos={level.goalPos}
            stars={level.stars}
            collectedStars={collectedStars}
            visitedCells={visitedCells}
            isExecuting={isExecuting}
            robotStatus={robotStatus}
            statusMessage={statusMessage}
            themeWorldId={level.worldId}
          />
        </div>

        {/* Center Column: Notebook Code Workspace */}
        <div className="lg:col-span-4 h-[420px] sm:h-[480px] lg:h-full">
          <Workspace
            blocks={blocks}
            onBlocksChange={setBlocks}
            activeBlockIndex={activeBlockIndex}
            activeSubBlockIndex={activeSubBlockIndex}
            isExecuting={isExecuting}
            optimalBlocks={level.optimalBlocks}
          />
        </div>

        {/* Right Column: Toolbox palette */}
        <div className="lg:col-span-3 h-[320px] sm:h-[400px] lg:h-full">
          <Toolbox
            allowedBlocks={level.allowedBlocks}
            onAddBlock={handleAddBlock}
            isExecuting={isExecuting}
          />
        </div>
      </div>

      {/* Modals */}
      <HintModal
        isOpen={hintOpen}
        onClose={() => setHintOpen(false)}
        hintText={level.hint}
        conceptTitle={level.concept}
      />

      <VictoryModal
        isOpen={victoryOpen}
        stars={earnedStars}
        blocksCount={blocks.length}
        optimalBlocks={level.optimalBlocks}
        earnedXP={earnedXP}
        levelNumber={level.id}
        hasNextLevel={hasNextLevel}
        onNextLevel={() => {
          setVictoryOpen(false);
          onNextLevel(level.id + 1);
        }}
        onReplay={() => {
          setVictoryOpen(false);
          resetGame();
        }}
        onSelectLevels={() => {
          setVictoryOpen(false);
          onBackToLevels();
        }}
      />
    </div>
  );
};
