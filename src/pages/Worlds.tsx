import React, { useState } from 'react';
import {
  Lock,
  Star,
  CheckCircle,
  Play,
  Compass,
  Sparkles,
  Repeat,
  GitFork,
  Trophy,
} from 'lucide-react';
import { WORLDS } from '../data/worlds';
import { ALL_LEVELS } from '../data/levels';
import { UserProgress } from '../types';
import { sound } from '../services/sound';

interface WorldsProps {
  progress: UserProgress;
  onSelectLevel: (levelId: number) => void;
}

export const Worlds: React.FC<WorldsProps> = ({ progress, onSelectLevel }) => {
  const [activeWorldId, setActiveWorldId] = useState<number>(1);

  const activeWorld =
    WORLDS.find((w) => w.id === activeWorldId) || WORLDS[0];

  const worldLevels = ALL_LEVELS.filter((l) => l.worldId === activeWorldId);

  const totalUserStars = Object.values(progress.levelProgress).reduce(
    (sum, p) => sum + p.stars,
    0
  );

  const getWorldIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Repeat':
        return <Repeat className="w-5 h-5" />;
      case 'GitFork':
        return <GitFork className="w-5 h-5" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Compass className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Title Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Pilih Dunia & Level Permainan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Total 80 Level yang dirancang untuk mengasah logika komputasional secara bertahap.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 text-xs font-semibold text-amber-900 shrink-0">
          <span>Koleksi Bintang Anda:</span>
          <span className="text-sm font-black font-mono text-amber-600 flex items-center gap-1">
            ⭐ {totalUserStars} / 240
          </span>
        </div>
      </div>

      {/* Worlds Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {WORLDS.map((world) => {
          const isSelected = world.id === activeWorldId;
          const isUnlocked = progress.unlockedWorlds.includes(world.id);

          // Count stars in this world
          const currentWorldLevelIds = ALL_LEVELS.filter(
            (l) => l.worldId === world.id
          ).map((l) => l.id);
          const worldStars = currentWorldLevelIds.reduce((sum, lvlId) => {
            return sum + (progress.levelProgress[lvlId]?.stars || 0);
          }, 0);

          return (
            <button
              key={world.id}
              onClick={() => {
                sound.playClick();
                setActiveWorldId(world.id);
              }}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-500/20'
                  : isUnlocked
                  ? 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:shadow-xs'
                  : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isUnlocked
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? (
                      getWorldIcon(world.iconName)
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-mono font-bold ${
                      isSelected ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    #{world.id}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold truncate">
                  {world.name}
                </h3>
                <p
                  className={`text-[11px] truncate mt-0.5 ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {world.conceptTag}
                </p>
              </div>

              <div
                className={`pt-3 mt-3 border-t text-[11px] flex items-center justify-between font-medium ${
                  isSelected ? 'border-white/20' : 'border-slate-100'
                }`}
              >
                <span>⭐ {worldStars} / {world.totalLevels * 3}</span>
                <span>{world.totalLevels} Level</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active World Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              {activeWorld.conceptTag}
            </span>
            <span className="text-xs text-slate-400">
              · {activeWorld.totalLevels} Level Tersedia
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            {activeWorld.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeWorld.description}
          </p>
        </div>

        <div className="z-10 shrink-0">
          {!progress.unlockedWorlds.includes(activeWorld.id) ? (
            <div className="bg-red-500/20 text-red-300 border border-red-500/30 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>
                Kumpulkan {activeWorld.requiredStarsToUnlock} ⭐ untuk Membuka
              </span>
            </div>
          ) : (
            <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Dunia Terbuka untuk Dijelajahi!</span>
            </div>
          )}
        </div>
      </div>

      {/* Levels Matrix */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-display">
          Daftar Level {activeWorld.name}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {worldLevels.map((lvl) => {
            const lvlProgress = progress.levelProgress[lvl.id];
            const isCompleted = lvlProgress?.completed;
            const stars = lvlProgress?.stars || 0;
            const isWorldUnlocked = progress.unlockedWorlds.includes(lvl.worldId);

            // A level is unlocked if it's the 1st level in an unlocked world, OR if the previous level is completed
            const isLevelUnlocked =
              isWorldUnlocked &&
              (lvl.worldLevelNumber === 1 ||
                progress.levelProgress[lvl.id - 1]?.completed);

            return (
              <button
                key={lvl.id}
                disabled={!isLevelUnlocked}
                onClick={() => {
                  if (isLevelUnlocked) {
                    sound.playClick();
                    onSelectLevel(lvl.id);
                  }
                }}
                className={`relative p-4 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between h-36 cursor-pointer ${
                  !isLevelUnlocked
                    ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                    : isCompleted
                    ? 'bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-md'
                    : 'bg-white border-blue-200 hover:border-blue-500 hover:shadow-md'
                }`}
              >
                {/* Level Number & Status */}
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold font-mono text-xs flex items-center justify-center">
                    {lvl.id}
                  </span>

                  {isCompleted ? (
                    <span className="text-xs text-amber-500 font-bold">
                      {'⭐'.repeat(stars)}
                    </span>
                  ) : !isLevelUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      Siap Main
                    </span>
                  )}
                </div>

                {/* Level Title & Optimal Info */}
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                    {lvl.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {lvl.concept}
                  </p>
                </div>

                {/* Bottom Target Optimal */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Target: ≤{lvl.optimalBlocks} blok</span>
                  {isLevelUnlocked && (
                    <span className="font-bold text-blue-600 flex items-center gap-0.5">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Main</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
