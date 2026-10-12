import React from 'react';
import { Volume2, VolumeX, Sparkles, Play } from 'lucide-react';
import { sound } from '../../services/sound';
import { StorageService } from '../../services/storage';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, levelId?: number) => void;
  totalXP: number;
  totalStars: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  totalXP,
  totalStars,
  soundEnabled,
  onToggleSound,
}) => {
  const navLinks = [
    { id: 'home', label: 'Beranda' },
    { id: 'learn', label: 'Belajar' },
    { id: 'worlds', label: 'Petualangan' },
    { id: 'daily', label: 'Tantangan' },
    { id: 'leaderboard', label: 'Papan Skor' },
    { id: 'about', label: 'Tentang' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            sound.playClick();
            onNavigate('home');
          }}
          className="text-xl font-bold tracking-tight text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 font-display flex items-center gap-2 cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            K
          </span>
          <span>Coding For Kids</span>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  sound.playClick();
                  onNavigate(link.id);
                }}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
                  isActive
                    ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                    : 'hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary action & quick controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <span className="text-amber-500 font-bold flex items-center gap-1">
              ⭐ <span className="tabular-nums font-mono">{totalStars}</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-blue-600 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="tabular-nums font-mono">{totalXP} XP</span>
            </span>
          </div>

          <button
            onClick={() => {
              onToggleSound();
            }}
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onNavigate('worlds');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Mulai Bermain</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-slate-50/80 px-2 py-1.5 overflow-x-auto text-xs">
        {navLinks.map((link) => {
          const isActive = currentTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => {
                sound.playClick();
                onNavigate(link.id);
              }}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
