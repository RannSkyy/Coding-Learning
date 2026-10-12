import React from 'react';
import { Plus, HelpCircle } from 'lucide-react';
import { BlockType } from '../../types';
import { sound } from '../../services/sound';

interface ToolboxProps {
  allowedBlocks: BlockType[];
  onAddBlock: (type: BlockType) => void;
  isExecuting: boolean;
}

interface BlockDefinition {
  type: BlockType;
  title: string;
  subtitle: string;
  bgGradient: string;
  borderColor: string;
  icon: string;
}

const ALL_TOOLBOX_ITEMS: BlockDefinition[] = [
  {
    type: 'MOVE_FORWARD',
    title: 'Maju',
    subtitle: '1 langkah ke depan',
    bgGradient: 'from-blue-600 to-blue-700',
    borderColor: 'border-blue-800',
    icon: '⬆️',
  },
  {
    type: 'TURN_LEFT',
    title: 'Belok Kiri',
    subtitle: 'Putar 90° ke kiri',
    bgGradient: 'from-sky-500 to-sky-600',
    borderColor: 'border-sky-700',
    icon: '↩️',
  },
  {
    type: 'TURN_RIGHT',
    title: 'Belok Kanan',
    subtitle: 'Putar 90° ke kanan',
    bgGradient: 'from-indigo-600 to-indigo-700',
    borderColor: 'border-indigo-800',
    icon: '↪️',
  },
  {
    type: 'JUMP',
    title: 'Lompat',
    subtitle: 'Lewati rintangan/air',
    bgGradient: 'from-orange-500 to-orange-600',
    borderColor: 'border-orange-700',
    icon: '🦘',
  },
  {
    type: 'PICK_STAR',
    title: 'Ambil Bintang',
    subtitle: 'Raih bintang di petak',
    bgGradient: 'from-amber-500 to-amber-600',
    borderColor: 'border-amber-700',
    icon: '⭐',
  },
  {
    type: 'REPEAT',
    title: 'Ulangi (Loop)',
    subtitle: 'Ulangi aksi berkali-kali',
    bgGradient: 'from-purple-600 to-purple-700',
    borderColor: 'border-purple-800',
    icon: '🔁',
  },
  {
    type: 'IF_OBSTACLE',
    title: 'Jika Rintangan',
    subtitle: 'Deteksi halangan depan',
    bgGradient: 'from-rose-600 to-rose-700',
    borderColor: 'border-rose-800',
    icon: '❓',
  },
  {
    type: 'IF_STAR',
    title: 'Jika Ada Bintang',
    subtitle: 'Deteksi keberadaan bintang',
    bgGradient: 'from-emerald-600 to-emerald-700',
    borderColor: 'border-emerald-800',
    icon: '✨',
  },
];

export const Toolbox: React.FC<ToolboxProps> = ({
  allowedBlocks,
  onAddBlock,
  isExecuting,
}) => {
  const visibleItems = ALL_TOOLBOX_ITEMS.filter((item) =>
    allowedBlocks.includes(item.type)
  );

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white border border-slate-200 shadow-xs p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800 font-display">
            Kotak Alat Perintah
          </h3>
          <p className="text-xs text-slate-500">
            Klik blok untuk menambahkan ke catatan
          </p>
        </div>
        <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
          {visibleItems.length} Blok
        </span>
      </div>

      {/* Block List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {visibleItems.map((item) => (
          <button
            key={item.type}
            disabled={isExecuting}
            onClick={() => {
              sound.playClick();
              onAddBlock(item.type);
            }}
            className={`w-full group flex items-center justify-between p-3 rounded-xl bg-gradient-to-r ${item.bgGradient} text-white shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 border-b-2 ${item.borderColor} disabled:opacity-40 disabled:pointer-events-none cursor-pointer text-left`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl filter drop-shadow-xs">{item.icon}</span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold tracking-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-white/80 font-normal">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <div className="w-6 h-6 rounded-lg bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </button>
        ))}
      </div>

      {/* Helpful learning tip */}
      <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-1.5">
        <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
        <span>Gunakan blok seminimal mungkin untuk mendapatkan 3 bintang penuh!</span>
      </div>
    </div>
  );
};
