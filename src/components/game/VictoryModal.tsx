import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, RotateCcw, LayoutGrid, Sparkles } from 'lucide-react';
import { sound } from '../../services/sound';

interface VictoryModalProps {
  isOpen: boolean;
  stars: number;
  blocksCount: number;
  optimalBlocks: number;
  earnedXP: number;
  levelNumber: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onSelectLevels: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  stars,
  blocksCount,
  optimalBlocks,
  earnedXP,
  levelNumber,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onSelectLevels,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playVictory();
      // Burst celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-center p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        {/* Decorative Top Mascot / Trophy Banner */}
        <div className="w-20 h-20 mx-auto -mt-2 mb-3 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-lg flex items-center justify-center">
          <Trophy className="w-10 h-10 text-amber-900 fill-amber-700/20" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 font-display mb-1">
          Hore! Misi Berhasil!
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Robot Kiko sukses menyelesaikan tantangan Level {levelNumber}!
        </p>

        {/* 3-Star Rating Graphic */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= stars;
            return (
              <div
                key={starIdx}
                className={`relative transition-all duration-300 transform ${
                  isEarned
                    ? 'scale-110 text-amber-400 filter drop-shadow-md'
                    : 'scale-90 text-slate-200'
                }`}
              >
                <Star
                  className={`w-12 h-12 ${
                    isEarned ? 'fill-amber-400' : 'fill-slate-200'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Performance metrics breakdown */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 flex items-center justify-around text-center">
          <div>
            <div className="text-xs text-slate-500">Blok Digunakan</div>
            <div className="text-lg font-black text-blue-600 font-mono tabular-nums">
              {blocksCount} <span className="text-xs text-slate-400 font-normal">blok</span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <div className="text-xs text-slate-500">Target Optimal</div>
            <div className="text-lg font-black text-emerald-600 font-mono tabular-nums">
              ≤ {optimalBlocks} <span className="text-xs text-slate-400 font-normal">blok</span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <div className="text-xs text-slate-500">Hadiah XP</div>
            <div className="text-lg font-black text-amber-600 font-mono tabular-nums flex items-center justify-center gap-0.5">
              <Sparkles className="w-4 h-4 fill-amber-400" />
              <span>+{earnedXP}</span>
            </div>
          </div>
        </div>

        {/* Motivational feedback based on stars */}
        <p className="text-xs font-medium text-slate-600 mb-6 px-2">
          {stars === 3
            ? '🌟 Sempurna! Susunan kodemu sangat efisien dan bersih seperti programmer profesional!'
            : stars === 2
            ? '👏 Hebat! Kamu berhasil. Bisakah kamu menemukan cara dengan lebih sedikit blok untuk 3 bintang?'
            : '👍 Bagus! Algoritmamu bekerja. Terus asah logikamu agar langkahnya semakin ringkas!'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {hasNextLevel ? (
            <button
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Level Selanjutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onSelectLevels();
              }}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>Selesai Seluruh Level!</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onReplay();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Level</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectLevels();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Daftar Level</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
