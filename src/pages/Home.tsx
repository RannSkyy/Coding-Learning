import React, { useState } from 'react';
import {
  Play,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  CheckCircle,
  ArrowRight,
  User,
  Compass,
  Trophy,
  Star,
  Zap,
} from 'lucide-react';
import { UserProgress, WorldConfig } from '../types';
import { WORLDS } from '../data/worlds';
import { sound } from '../services/sound';
import { StorageService } from '../services/storage';

interface HomeProps {
  progress: UserProgress;
  onNavigate: (tab: string, levelId?: number) => void;
  onUpdateName: (name: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  progress,
  onNavigate,
  onUpdateName,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.playerName);

  const totalLevels = 80;
  const completedLevelsCount = Object.values(progress.levelProgress).filter(
    (p) => p.completed
  ).length;
  const totalStars = Object.values(progress.levelProgress).reduce(
    (sum, p) => sum + p.stars,
    0
  );
  const progressPercent = Math.round((completedLevelsCount / totalLevels) * 100);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  // Find next playable level
  const lastLevelId = progress.lastPlayedLevelId || 1;
  const nextPlayableLevelId = progress.levelProgress[lastLevelId]?.completed
    ? Math.min(lastLevelId + 1, 80)
    : lastLevelId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-xl border border-blue-500/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs border border-white/15">
              <span>🚀 Belajar Algoritma & Logika Pemrograman</span>
              <span>·</span>
              <span>Jenjang SMP & SD</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight text-white">
              Belajar Berpikir Seperti Programmer{' '}
              <span className="text-amber-300 underline decoration-wavy decoration-amber-400">
                Tanpa Menulis Kode.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-blue-100 max-w-xl leading-relaxed">
              Bimbing Robot Kiko melewati 80 puzzle petualangan! Susun langkah, gunakan perulangan, dan buat keputusan cerdas melalui drag & drop blok visual.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('play', nextPlayableLevelId);
                }}
                className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Lanjutkan Level {nextPlayableLevelId}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('learn');
                }}
                className="px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Pelajari Konsep</span>
              </button>
            </div>
          </div>

          {/* Right Mascot Visual Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl transform scale-110" />
              <img
                src="/src/assets/images/coding_robot_mascot_1791823122516.jpg"
                alt="Robot Kiko Mascot"
                className="relative z-10 w-full h-full object-contain rounded-3xl shadow-2xl border-4 border-white/20 transform hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Player Progress Strip */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Player Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg font-display">
              {progress.playerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span>Profil Siswa</span>
                {!isEditingName && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-blue-600 hover:underline text-[11px] font-medium cursor-pointer"
                  >
                    (Ganti)
                  </button>
                )}
              </div>
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-1 mt-0.5">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="border border-slate-300 rounded px-2 py-0.5 text-xs font-semibold w-28 focus:outline-blue-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded cursor-pointer"
                  >
                    OK
                  </button>
                </form>
              ) : (
                <h3 className="text-sm font-bold text-slate-900 truncate max-w-[140px]">
                  {progress.playerName}
                </h3>
              )}
            </div>
          </div>

          {/* Level Progress Meter */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-slate-600">Level Diselesaikan</span>
              <span className="text-blue-600 tabular-nums font-mono">
                {completedLevelsCount} / {totalLevels} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Total Stars */}
          <div className="flex items-center gap-3 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-500 text-xl">
              ⭐
            </div>
            <div>
              <div className="text-xs text-amber-900/70 font-medium">Bintang Terkumpul</div>
              <div className="text-lg font-black text-amber-800 font-mono tabular-nums">
                {totalStars}{' '}
                <span className="text-xs font-normal text-amber-700/60">/ 240</span>
              </div>
            </div>
          </div>

          {/* Total XP */}
          <div className="flex items-center gap-3 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-blue-900/70 font-medium">Total Pengalaman</div>
              <div className="text-lg font-black text-blue-700 font-mono tabular-nums">
                {progress.totalXP} XP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Challenge Card + Quick Learning Hub */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Challenge Box */}
        <div className="md:col-span-1 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-2.5 py-1 rounded-full">
                Tantangan Harian
              </span>
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black font-display mb-1.5">
              Daily Puzzle: Labirin Misteri
            </h3>
            <p className="text-xs text-white/90 leading-relaxed mb-4">
              Selesaikan 1 puzzle khusus hari ini untuk memperoleh bonus 150 XP dan lencana Tantangan Harian!
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onNavigate('daily');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-orange-900 font-bold text-xs shadow-xs hover:bg-orange-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Buka Tantangan Hari Ini</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Thinking Pillars in Computing */}
        <div className="md:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 font-display">
                4 Pilar Berpikir Komputasional (Computational Thinking)
              </h3>
              <span className="text-xs text-slate-400">Kurikulum Informatika SMP</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Melatih cara berpikir sistematis yang digunakan oleh programmer dan ilmuwan di seluruh dunia.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <span className="text-base mb-1 block">🧩</span>
                <h4 className="text-xs font-bold text-blue-900">Dekomposisi</h4>
                <p className="text-[10px] text-blue-700/80 mt-0.5">Memecah masalah rumit jadi langkah kecil.</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100">
                <span className="text-base mb-1 block">🔁</span>
                <h4 className="text-xs font-bold text-purple-900">Pola (Pattern)</h4>
                <p className="text-[10px] text-purple-700/80 mt-0.5">Menemukan kesamaan untuk membuat loop.</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-base mb-1 block">🔍</span>
                <h4 className="text-xs font-bold text-emerald-900">Abstraksi</h4>
                <p className="text-[10px] text-emerald-700/80 mt-0.5">Fokus pada rute penting tanpa distraksi.</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="text-base mb-1 block">📐</span>
                <h4 className="text-xs font-bold text-amber-900">Algoritma</h4>
                <p className="text-[10px] text-amber-700/80 mt-0.5">Menyusun instruksi yang urut dan logis.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Materi interaktif siap dipelajari!</span>
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('learn');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Buka Menu Belajar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5 Worlds Overview Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 font-display">
              Peta 5 Dunia Petualangan
            </h2>
            <p className="text-xs text-slate-500">
              Total 80 Level dari Tingkat Dasar hingga Labirin Master
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onNavigate('worlds');
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Dunia</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {WORLDS.map((world) => {
            const isUnlocked = progress.unlockedWorlds.includes(world.id);
            // Count stars in this world
            const worldLevels = Array.from(
              { length: world.totalLevels },
              (_, i) => (world.id === 1 ? 1 : (world.id - 1) * 15 + 1) + i
            );
            const starsInWorld = worldLevels.reduce((sum, lvlId) => {
              return sum + (progress.levelProgress[lvlId]?.stars || 0);
            }, 0);

            return (
              <div
                key={world.id}
                onClick={() => {
                  if (isUnlocked) {
                    sound.playClick();
                    onNavigate('worlds');
                  }
                }}
                className={`relative rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white border-slate-200 hover:shadow-md hover:border-blue-300 cursor-pointer'
                    : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{world.id}
                    </span>
                    <span className="text-xs font-semibold text-amber-500">
                      ⭐ {starsInWorld} / {world.totalLevels * 3}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {world.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                    {world.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400">{world.totalLevels} Level</span>
                  {isUnlocked ? (
                    <span className="text-blue-600 font-bold">Terbuka ✓</span>
                  ) : (
                    <span className="text-slate-400">
                      🔒 Butuh {world.requiredStarsToUnlock} ⭐
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
