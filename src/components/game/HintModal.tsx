import React from 'react';
import { Lightbulb, X, ArrowRight } from 'lucide-react';
import { sound } from '../../services/sound';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hintText: string;
  conceptTitle: string;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  hintText,
  conceptTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-amber-200 overflow-hidden p-6 animate-in zoom-in-95 duration-150">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 fill-amber-500 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Petunjuk Berpikir Logika
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">{conceptTitle}</p>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-4 mb-4">
          <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
            "{hintText}"
          </p>
        </div>

        <p className="text-[11px] text-slate-400 mb-4">
          💡 Tips: Coba simulasikan langkah robot di kepalamu atau hitung petak jalan setapak satu demi satu!
        </p>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Saya Mengerti, Ayo Coba!</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
