import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Award,
  ArrowLeft,
} from 'lucide-react';
import { LevelConfig, CodeBlock, BlockType, Direction, UserProgress } from '../types';
import { sound } from '../services/sound';
import { StorageService } from '../services/storage';
import { GameBoard } from '../components/game/GameBoard';
import { Workspace } from '../components/game/Workspace';
import { Toolbox } from '../components/game/Toolbox';
import { VictoryModal } from '../components/game/VictoryModal';
import { HintModal } from '../components/game/HintModal';

interface DailyChallengeProps {
  progress: UserProgress;
  onBackToHome: () => void;
  onRefreshProgress: () => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  progress,
  onBackToHome,
  onRefreshProgress,
}) => {
  // Today's Date String
  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Daily puzzle config
  const dailyLevel: LevelConfig = {
    id: 999,
    worldId: 5,
    worldLevelNumber: 1,
    title: 'Tantangan Harian: Menyeberangi Danau Kristal',
    concept: 'Integrasi Gerak, Lompat, & Pengambilan Bintang',
    instructions:
      'Lompati celah air, ambil 2 kristal bintang emas, dan capai bendera di seberang danau!',
    hint: 'Gunakan blok Lompat untuk melompati petak air, dan jangan lupa blok Ambil Bintang saat berdiri di atasnya!',
    gridSize: { width: 6, height: 6 },
    startPos: { x: 1, y: 1 },
    startDir: 'RIGHT',
    goalPos: { x: 4, y: 4 },
    grid: [
      ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
      ['EMPTY', 'PATH', 'PATH', 'WATER', 'PATH', 'EMPTY'],
      ['EMPTY', 'EMPTY', 'OBSTACLE', 'EMPTY', 'PATH', 'EMPTY'],
      ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'PATH', 'EMPTY'],
      ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'PATH', 'EMPTY'],
      ['EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'],
    ],
    stars: [
      { x: 2, y: 1 },
      { x: 4, y: 3 },
    ],
    optimalBlocks: 7,
    allowedBlocks: [
      'MOVE_FORWARD',
      'TURN_LEFT',
      'TURN_RIGHT',
      'JUMP',
      'PICK_STAR',
      'REPEAT',
    ],
  };

  const [robotPos, setRobotPos] = useState<{ x: number; y: number }>(dailyLevel.startPos);
  const [robotDir, setRobotDir] = useState<Direction>(dailyLevel.startDir);
  const [collectedStars, setCollectedStars] = useState<{ x: number; y: number }[]>([]);
  const [visitedCells, setVisitedCells] = useState<{ x: number; y: number }[]>([dailyLevel.startPos]);
  const [robotStatus, setRobotStatus] = useState<
    'idle' | 'walking' | 'jumping' | 'collecting' | 'error' | 'victory'
  >('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const [blocks, setBlocks] = useState<CodeBlock[]>([
    { id: 'daily-1', type: 'MOVE_FORWARD' },
    { id: 'daily-2', type: 'PICK_STAR' },
  ]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);
  const [activeSubBlockIndex, setActiveSubBlockIndex] = useState<{
    parentIndex: number;
    subIndex: number;
  } | null>(null);

  const [hintOpen, setHintOpen] = useState<boolean>(false);
  const [victoryOpen, setVictoryOpen] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [earnedXP, setEarnedXP] = useState<number>(150);

  const abortRef = useRef<boolean>(false);

  const resetGame = () => {
    abortRef.current = true;
    setIsExecuting(false);
    setActiveBlockIndex(null);
    setActiveSubBlockIndex(null);
    setRobotPos(dailyLevel.startPos);
    setRobotDir(dailyLevel.startDir);
    setCollectedStars([]);
    setVisitedCells([dailyLevel.startPos]);
    setRobotStatus('idle');
    setStatusMessage('');
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const getFacingCoord = (pos: { x: number; y: number }, dir: Direction, dist = 1) => {
    switch (dir) {
      case 'UP':
        return { x: pos.x, y: pos.y - dist };
      case 'RIGHT':
        return { x: pos.x + dist, y: pos.y };
      case 'DOWN':
        return { x: pos.x, y: pos.y + dist };
      case 'LEFT':
        return { x: pos.x - dist, y: pos.y };
    }
  };

  const getTurnDir = (current: Direction, turn: 'LEFT' | 'RIGHT'): Direction => {
    const clockwise: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
    const idx = clockwise.indexOf(current);
    return turn === 'RIGHT' ? clockwise[(idx + 1) % 4] : clockwise[(idx + 3) % 4];
  };

  const runProgram = async () => {
    if (isExecuting) {
      abortRef.current = true;
      setIsExecuting(false);
      return;
    }

    if (blocks.length === 0) {
      sound.playError();
      setStatusMessage('Belum ada blok instruksi!');
      return;
    }

    abortRef.current = false;
    setIsExecuting(true);
    setRobotPos(dailyLevel.startPos);
    setRobotDir(dailyLevel.startDir);
    setCollectedStars([]);
    setVisitedCells([dailyLevel.startPos]);
    setRobotStatus('idle');
    setStatusMessage('Robot Kiko memulai tantangan harian...');

    let curPos = { ...dailyLevel.startPos };
    let curDir = dailyLevel.startDir;
    let curStars: { x: number; y: number }[] = [];
    let curVisited = [{ ...dailyLevel.startPos }];

    const executeAction = async (type: BlockType): Promise<boolean> => {
      if (abortRef.current) return false;

      if (type === 'MOVE_FORWARD') {
        const next = getFacingCoord(curPos, curDir, 1);
        if (
          next.x < 0 ||
          next.x >= dailyLevel.gridSize.width ||
          next.y < 0 ||
          next.y >= dailyLevel.gridSize.height
        ) {
          sound.playError();
          setRobotStatus('error');
          setStatusMessage('Aduh! Kiko keluar dari peta!');
          return false;
        }

        const cell = dailyLevel.grid[next.y][next.x];
        if (cell === 'OBSTACLE' || cell === 'WATER') {
          sound.playError();
          setRobotStatus('error');
          setStatusMessage('Oops! Di depan ada rintangan!');
          return false;
        }

        curPos = next;
        setRobotPos(curPos);
        curVisited = [...curVisited, curPos];
        setVisitedCells(curVisited);
        sound.playStep();
        setRobotStatus('walking');
        await sleep(400);
        return true;
      }

      if (type === 'TURN_LEFT') {
        curDir = getTurnDir(curDir, 'LEFT');
        setRobotDir(curDir);
        sound.playClick();
        await sleep(400);
        return true;
      }

      if (type === 'TURN_RIGHT') {
        curDir = getTurnDir(curDir, 'RIGHT');
        setRobotDir(curDir);
        sound.playClick();
        await sleep(400);
        return true;
      }

      if (type === 'JUMP') {
        const landing = getFacingCoord(curPos, curDir, 2);
        if (
          landing.x < 0 ||
          landing.x >= dailyLevel.gridSize.width ||
          landing.y < 0 ||
          landing.y >= dailyLevel.gridSize.height
        ) {
          sound.playError();
          setRobotStatus('error');
          setStatusMessage('Lompatan mendarat di luar batas!');
          return false;
        }

        curPos = landing;
        setRobotPos(curPos);
        curVisited = [...curVisited, curPos];
        setVisitedCells(curVisited);
        sound.playJump();
        setRobotStatus('jumping');
        await sleep(500);
        setRobotStatus('idle');
        return true;
      }

      if (type === 'PICK_STAR') {
        const starHere = dailyLevel.stars.find(
          (s) => s.x === curPos.x && s.y === curPos.y
        );
        const already = curStars.some((s) => s.x === curPos.x && s.y === curPos.y);

        if (starHere && !already) {
          curStars = [...curStars, starHere];
          setCollectedStars(curStars);
          sound.playCollect();
          setRobotStatus('collecting');
          setStatusMessage('Bintang berhasil diambil! ⭐');
          await sleep(400);
          setRobotStatus('idle');
        } else {
          setStatusMessage('Tidak ada bintang di petak ini.');
          await sleep(350);
        }
        return true;
      }

      return true;
    };

    for (let i = 0; i < blocks.length; i++) {
      if (abortRef.current) break;
      setActiveBlockIndex(i);
      setActiveSubBlockIndex(null);

      const block = blocks[i];
      if (block.type === 'REPEAT') {
        const count = block.repeatCount || 2;
        const inners = block.innerBlocks || [];
        for (let r = 0; r < count; r++) {
          if (abortRef.current) break;
          for (let sIdx = 0; sIdx < inners.length; sIdx++) {
            if (abortRef.current) break;
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

    // Victory check
    const isAtGoal =
      curPos.x === dailyLevel.goalPos.x && curPos.y === dailyLevel.goalPos.y;
    const collectedAll = curStars.length >= dailyLevel.stars.length;

    if (isAtGoal && collectedAll) {
      setRobotStatus('victory');
      setStatusMessage('Hore! Daily Challenge Selesai! 🎉');
      setEarnedStars(3);
      setEarnedXP(200);

      // Award daily achievement and save
      const curProg = StorageService.getProgress();
      const updatedAch = curProg.achievements.includes('daily_champion')
        ? curProg.achievements
        : [...curProg.achievements, 'daily_champion'];
      StorageService.saveProgress({
        ...curProg,
        totalXP: curProg.totalXP + 200,
        achievements: updatedAch,
        dailyChallengeCompletedDate: new Date().toISOString().split('T')[0],
      });
      onRefreshProgress();
      setVictoryOpen(true);
    } else {
      sound.playError();
      setStatusMessage('Belum memenuhi misi: Kumpulkan 2 bintang dan capai bendera!');
    }
  };

  const handleAddBlock = (type: BlockType) => {
    if (isExecuting) return;
    setBlocks((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        type,
        repeatCount: type === 'REPEAT' ? 2 : undefined,
        innerBlocks:
          type === 'REPEAT'
            ? [{ id: `${Date.now()}-sub`, type: 'MOVE_FORWARD' }]
            : undefined,
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onBackToHome();
            }}
            className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
              <Calendar className="w-4 h-4" />
              <span>{todayStr}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-display text-white mt-0.5">
              Tantangan Harian (Daily Challenge)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setHintOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Petunjuk</span>
          </button>

          <button
            onClick={resetGame}
            className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            onClick={runProgram}
            className="px-5 py-2 rounded-xl bg-white text-orange-950 hover:bg-amber-100 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Jalankan (RUN)</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[560px]">
        <div className="lg:col-span-5 h-[420px] sm:h-[480px] lg:h-full">
          <GameBoard
            gridSize={dailyLevel.gridSize}
            grid={dailyLevel.grid}
            robotPos={robotPos}
            robotDir={robotDir}
            goalPos={dailyLevel.goalPos}
            stars={dailyLevel.stars}
            collectedStars={collectedStars}
            visitedCells={visitedCells}
            isExecuting={isExecuting}
            robotStatus={robotStatus}
            statusMessage={statusMessage}
            themeWorldId={5}
          />
        </div>

        <div className="lg:col-span-4 h-[420px] sm:h-[480px] lg:h-full">
          <Workspace
            blocks={blocks}
            onBlocksChange={setBlocks}
            activeBlockIndex={activeBlockIndex}
            activeSubBlockIndex={activeSubBlockIndex}
            isExecuting={isExecuting}
            optimalBlocks={dailyLevel.optimalBlocks}
          />
        </div>

        <div className="lg:col-span-3 h-[320px] sm:h-[400px] lg:h-full">
          <Toolbox
            allowedBlocks={dailyLevel.allowedBlocks}
            onAddBlock={handleAddBlock}
            isExecuting={isExecuting}
          />
        </div>
      </div>

      <HintModal
        isOpen={hintOpen}
        onClose={() => setHintOpen(false)}
        hintText={dailyLevel.hint}
        conceptTitle={dailyLevel.concept}
      />

      <VictoryModal
        isOpen={victoryOpen}
        stars={earnedStars}
        blocksCount={blocks.length}
        optimalBlocks={dailyLevel.optimalBlocks}
        earnedXP={earnedXP}
        levelNumber={1}
        hasNextLevel={false}
        onNextLevel={() => onBackToHome()}
        onReplay={() => {
          setVictoryOpen(false);
          resetGame();
        }}
        onSelectLevels={() => onBackToHome()}
      />
    </div>
  );
};
