import React from 'react';
import {
  Trophy,
  Medal,
  Star,
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { UserProgress } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';
import { sound } from '../services/sound';
import { StorageService } from '../services/storage';

interface LeaderboardProps {
  progress: UserProgress;
  onRefreshProgress: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  progress,
  onRefreshProgress,
}) => {
  const totalStars = Object.values(progress.levelProgress).reduce(
    (sum, p) => sum + p.stars,
    0
  );
  const completedLevels = Object.values(progress.levelProgress).filter(
    (p) => p.completed
  ).length;

  // Calculate student logic title based on XP
  const getRankTitle = (xp: number) => {
    if (xp >= 5000) return 'Grandmaster Algoritma';
    if (xp >= 3000) return 'Master Pemrograman SMP';
    if (xp >= 1500) return 'Pakar Logika Senior';
    if (xp >= 600) return 'Penjelajah Kode Cerdas';
    if (xp >= 200) return 'Pemrogram Pemula Handal';
    return 'Pelajar Kode Baru';
  };

  // Mock class leaderboard peers
  const mockStudents = [
    { name: 'Nadia Putri', xp: 4200, stars: 126, levels: 48, avatar: '👧' },
    { name: 'Rafi Pratama', xp: 3850, stars: 115, levels: 42, avatar: '👦' },
    { name: 'Aisyah Zahra', xp: 2900, stars: 92, levels: 35, avatar: '🧕' },
    { name: 'Budi Santoso', xp: 1800, stars: 60, levels: 24, avatar: '🧑' },
    { name: 'Dimas Anggara', xp: 1100, stars: 40, levels: 16, avatar: '👦' },
  ];

  // Combine player with peers and sort by XP
  const allRankings = [
    ...mockStudents,
    {
      name: `${progress.playerName} (Kamu)`,
      xp: progress.totalXP,
      stars: totalStars,
      levels: completedLevels,
      avatar: '🤖',
      isCurrentPlayer: true,
    },
  ].sort((a, b) => b.xp - a.xp);

  const handleResetData = () => {
    if (
      window.confirm(
        'Apakah kamu yakin ingin mereset seluruh progres belajar dan pencapaian?'
      )
    ) {
      StorageService.resetAllProgress();
      onRefreshProgress();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Papan Skor & Pencapaian
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Lihat prestasimu, kumpulkan lencana prestasi, dan bandingkan skor efisiensi kodemu.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition-colors self-start md:self-auto cursor-pointer"
        >
          Reset Progres
        </button>
      </div>

      {/* Player Showcase Card */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xs border-2 border-white/30 flex items-center justify-center text-4xl shadow-inner">
            🤖
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {getRankTitle(progress.totalXP)}
            </span>
            <h2 className="text-2xl font-black font-display text-white">
              {progress.playerName}
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Telah menaklukkan {completedLevels} dari 80 level permainan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs px-6 py-4 rounded-2xl border border-white/20 text-center">
          <div>
            <div className="text-xs text-blue-200 font-medium">Bintang</div>
            <div className="text-xl font-black font-mono text-amber-300 flex items-center justify-center gap-1">
              ⭐ {totalStars}
            </div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <div className="text-xs text-blue-200 font-medium">Total XP</div>
            <div className="text-xl font-black font-mono text-white flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              {progress.totalXP}
            </div>
          </div>
        </div>
      </div>

      {/* 2 Columns: Leaderboard & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Class Leaderboard List */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                Peringkat Teman Sekelas
              </h3>
            </div>
            <span className="text-xs text-slate-500">Berdasarkan Total XP</span>
          </div>

          <div className="space-y-2.5">
            {allRankings.map((student, idx) => {
              const isCurrent = (student as { isCurrentPlayer?: boolean }).isCurrentPlayer;
              const isTop3 = idx < 3;

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black font-mono text-xs ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-700'
                          : idx === 2
                          ? 'bg-amber-200/50 text-amber-900'
                          : 'bg-slate-50 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <span className="text-xl">{student.avatar}</span>

                    <div>
                      <h4
                        className={`text-xs sm:text-sm font-bold ${
                          isCurrent ? 'text-blue-900 font-black' : 'text-slate-800'
                        }`}
                      >
                        {student.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {student.levels} level · {student.stars} ⭐
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-black font-mono text-blue-600">
                      {student.xp} XP
                    </div>
                    {isTop3 && (
                      <span className="text-[10px] text-amber-600 font-semibold">
                        Medali Juara
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Achievements Showcase */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                Koleksi Lencana Prestasi
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {progress.achievements.length} / {ACHIEVEMENTS.length}
            </span>
          </div>

          <div className="space-y-3">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = progress.achievements.includes(ach.id);

              return (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isUnlocked
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-800 shadow-2xs'
                      : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isUnlocked
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {ach.title}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-amber-600 shrink-0">
                        +{ach.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
