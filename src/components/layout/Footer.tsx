import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 font-display">Coding For Kids</span>
          <span>—</span>
          <span>Belajar Berpikir Seperti Programmer Tanpa Menulis Kode</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Beranda
          </button>
          <button
            onClick={() => onNavigate('learn')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Belajar
          </button>
          <button
            onClick={() => onNavigate('worlds')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Petualangan 80 Level
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Tentang
          </button>
        </div>
      </div>
    </footer>
  );
};
