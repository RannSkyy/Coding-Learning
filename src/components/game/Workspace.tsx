import React from 'react';
import {
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  RotateCw,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { CodeBlock, BlockType } from '../../types';
import { sound } from '../../services/sound';

interface WorkspaceProps {
  blocks: CodeBlock[];
  onBlocksChange: (blocks: CodeBlock[]) => void;
  activeBlockIndex: number | null;
  activeSubBlockIndex: { parentIndex: number; subIndex: number } | null;
  isExecuting: boolean;
  optimalBlocks: number;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  blocks,
  onBlocksChange,
  activeBlockIndex,
  activeSubBlockIndex,
  isExecuting,
  optimalBlocks,
}) => {
  // Move block up
  const handleMoveUp = (index: number) => {
    if (index <= 0 || isExecuting) return;
    sound.playClick();
    const updated = [...blocks];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onBlocksChange(updated);
  };

  // Move block down
  const handleMoveDown = (index: number) => {
    if (index >= blocks.length - 1 || isExecuting) return;
    sound.playClick();
    const updated = [...blocks];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onBlocksChange(updated);
  };

  // Delete top-level block
  const handleDeleteBlock = (index: number) => {
    if (isExecuting) return;
    sound.playClick();
    const updated = blocks.filter((_, i) => i !== index);
    onBlocksChange(updated);
  };

  // Change repeat count
  const handleRepeatCountChange = (index: number, count: number) => {
    if (isExecuting) return;
    const updated = [...blocks];
    updated[index] = { ...updated[index], repeatCount: count };
    onBlocksChange(updated);
  };

  // Add inner block inside Repeat / If container
  const handleAddSubBlock = (parentIndex: number, type: BlockType) => {
    if (isExecuting) return;
    sound.playClick();
    const updated = [...blocks];
    const currentSub = updated[parentIndex].innerBlocks || [];
    updated[parentIndex] = {
      ...updated[parentIndex],
      innerBlocks: [
        ...currentSub,
        { id: `${Date.now()}-${Math.random()}`, type },
      ],
    };
    onBlocksChange(updated);
  };

  // Remove inner block
  const handleRemoveSubBlock = (parentIndex: number, subIndex: number) => {
    if (isExecuting) return;
    sound.playClick();
    const updated = [...blocks];
    const currentSub = updated[parentIndex].innerBlocks || [];
    updated[parentIndex] = {
      ...updated[parentIndex],
      innerBlocks: currentSub.filter((_, i) => i !== subIndex),
    };
    onBlocksChange(updated);
  };

  // Clear all blocks
  const handleClearAll = () => {
    if (isExecuting || blocks.length === 0) return;
    sound.playClick();
    onBlocksChange([]);
  };

  const getBlockMeta = (type: BlockType) => {
    switch (type) {
      case 'MOVE_FORWARD':
        return {
          label: 'Maju (Step Forward)',
          bg: 'bg-blue-600',
          hoverBg: 'hover:bg-blue-700',
          border: 'border-blue-700',
          icon: '⬆️',
        };
      case 'TURN_LEFT':
        return {
          label: 'Belok Kiri (Turn Left)',
          bg: 'bg-sky-600',
          hoverBg: 'hover:bg-sky-700',
          border: 'border-sky-700',
          icon: '↩️',
        };
      case 'TURN_RIGHT':
        return {
          label: 'Belok Kanan (Turn Right)',
          bg: 'bg-indigo-600',
          hoverBg: 'hover:bg-indigo-700',
          border: 'border-indigo-700',
          icon: '↪️',
        };
      case 'JUMP':
        return {
          label: 'Lompat (Jump Forward)',
          bg: 'bg-orange-500',
          hoverBg: 'hover:bg-orange-600',
          border: 'border-orange-600',
          icon: '🦘',
        };
      case 'PICK_STAR':
        return {
          label: 'Ambil Bintang (Pick Star)',
          bg: 'bg-amber-500',
          hoverBg: 'hover:bg-amber-600',
          border: 'border-amber-600',
          icon: '⭐',
        };
      case 'REPEAT':
        return {
          label: 'Ulangi (Repeat)',
          bg: 'bg-purple-600',
          hoverBg: 'hover:bg-purple-700',
          border: 'border-purple-700',
          icon: '🔁',
        };
      case 'IF_OBSTACLE':
        return {
          label: 'Jika Ada Rintangan (If Obstacle)',
          bg: 'bg-rose-600',
          hoverBg: 'hover:bg-rose-700',
          border: 'border-rose-700',
          icon: '❓',
        };
      case 'IF_STAR':
        return {
          label: 'Jika Di Petak Bintang (If Star)',
          bg: 'bg-emerald-600',
          hoverBg: 'hover:bg-emerald-700',
          border: 'border-emerald-700',
          icon: '✨',
        };
    }
  };

  return (
    <div className="relative flex flex-col h-full rounded-2xl bg-white border border-slate-300 shadow-sm overflow-hidden">
      {/* Notebook Spine / Header Bar */}
      <div className="bg-amber-100/70 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-1 text-xs font-bold text-amber-900 font-display">
            Buku Catatan Algoritma
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-600 font-medium">
            Jumlah Blok:{' '}
            <strong className="text-blue-600 tabular-nums font-mono">{blocks.length}</strong> / Target Optimal:{' '}
            <strong className="text-emerald-700 tabular-nums font-mono">{optimalBlocks}</strong>
          </span>
          {blocks.length > 0 && !isExecuting && (
            <button
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-0.5 rounded text-xs transition-colors cursor-pointer"
            >
              Kosongkan
            </button>
          )}
        </div>
      </div>

      {/* Notebook Ruled Body (Drop & Program sequence area) */}
      <div className="flex-1 notebook-pattern p-4 overflow-y-auto space-y-2 relative min-h-[300px]">
        {blocks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <span className="text-3xl mb-2">📋</span>
            <h4 className="text-sm font-semibold text-slate-700 mb-1">
              Buku Catatan Masih Kosong
            </h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Klik atau pilih blok perintah dari menu di sebelah kanan untuk mulai menyusun langkah Robot Kiko!
            </p>
          </div>
        ) : (
          blocks.map((block, idx) => {
            const meta = getBlockMeta(block.type);
            const isCurrentlyExecuting = activeBlockIndex === idx;
            const isContainer = block.type === 'REPEAT' || block.type === 'IF_OBSTACLE' || block.type === 'IF_STAR';

            return (
              <div
                key={block.id}
                className={`relative rounded-xl transition-all duration-200 border-2 ${
                  isCurrentlyExecuting
                    ? 'border-yellow-400 ring-4 ring-yellow-300/60 shadow-lg scale-[1.01]'
                    : `${meta.border} shadow-xs`
                } ${isContainer ? 'bg-purple-50/40 p-2' : ''}`}
              >
                {/* Main Block Item */}
                <div
                  className={`flex items-center justify-between text-white px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium ${meta.bg}`}
                >
                  {/* Left: Step number + Icon + Label */}
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/20 text-white font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-base">{meta.icon}</span>
                    <span className="font-semibold">{meta.label}</span>

                    {/* Repeat count selector */}
                    {block.type === 'REPEAT' && (
                      <div className="flex items-center gap-1 ml-2 bg-black/25 px-2 py-0.5 rounded-md text-xs">
                        <span>Sebanyak:</span>
                        <select
                          disabled={isExecuting}
                          value={block.repeatCount || 2}
                          onChange={(e) =>
                            handleRepeatCountChange(idx, Number(e.target.value))
                          }
                          className="bg-purple-900 text-white font-bold rounded px-1 text-xs cursor-pointer focus:outline-none"
                        >
                          <option value={2}>2 kali</option>
                          <option value={3}>3 kali</option>
                          <option value={4}>4 kali</option>
                          <option value={5}>5 kali</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Right: Controls (Move up, move down, remove) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0 || isExecuting}
                      title="Geser ke Atas"
                      className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === blocks.length - 1 || isExecuting}
                      title="Geser ke Bawah"
                      className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlock(idx)}
                      disabled={isExecuting}
                      title="Hapus Blok"
                      className="p-1 text-white/80 hover:text-red-200 hover:bg-red-500/30 rounded disabled:opacity-30 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Container Inner Steps (for Loop & If blocks) */}
                {isContainer && (
                  <div className="mt-2 pl-4 border-l-4 border-purple-300 ml-3 space-y-1.5 py-1">
                    <div className="text-[11px] font-bold text-purple-800 flex items-center justify-between">
                      <span>↳ Langkah di dalam blok {meta.label}:</span>
                      {!isExecuting && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleAddSubBlock(idx, 'MOVE_FORWARD')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 rounded text-[10px] cursor-pointer"
                          >
                            + Maju
                          </button>
                          <button
                            onClick={() => handleAddSubBlock(idx, 'TURN_RIGHT')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-1.5 py-0.5 rounded text-[10px] cursor-pointer"
                          >
                            + Kanan
                          </button>
                          <button
                            onClick={() => handleAddSubBlock(idx, 'TURN_LEFT')}
                            className="bg-sky-600 hover:bg-sky-700 text-white px-1.5 py-0.5 rounded text-[10px] cursor-pointer"
                          >
                            + Kiri
                          </button>
                          <button
                            onClick={() => handleAddSubBlock(idx, 'JUMP')}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-1.5 py-0.5 rounded text-[10px] cursor-pointer"
                          >
                            + Lompat
                          </button>
                        </div>
                      )}
                    </div>

                    {(block.innerBlocks || []).length === 0 ? (
                      <div className="text-[11px] text-purple-600 italic bg-purple-100/60 p-2 rounded-md">
                        Klik tombol '+' di atas untuk menambahkan perintah yang akan diulang!
                      </div>
                    ) : (
                      block.innerBlocks?.map((sub, sIdx) => {
                        const subMeta = getBlockMeta(sub.type);
                        const isSubActive =
                          activeSubBlockIndex?.parentIndex === idx &&
                          activeSubBlockIndex?.subIndex === sIdx;

                        return (
                          <div
                            key={sub.id}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-white text-xs ${
                              subMeta.bg
                            } ${
                              isSubActive
                                ? 'ring-3 ring-yellow-400 font-bold scale-[1.02]'
                                : ''
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span>{subMeta.icon}</span>
                              <span>{subMeta.label}</span>
                            </div>
                            {!isExecuting && (
                              <button
                                onClick={() => handleRemoveSubBlock(idx, sIdx)}
                                className="hover:text-red-200 text-white/80 p-0.5 rounded cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Notebook Bottom Action / Trash Bin bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          💡 <span>Urutan blok dibaca dari atas ke bawah.</span>
        </span>
        <button
          onClick={handleClearAll}
          disabled={blocks.length === 0 || isExecuting}
          title="Hapus Semua Blok"
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
