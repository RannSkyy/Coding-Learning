import React, { useState } from 'react';
import {
  Layers,
  ArrowDownNarrowWide,
  Repeat,
  GitFork,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Play,
  Lightbulb,
} from 'lucide-react';
import { LEARNING_TOPICS } from '../data/learningMaterials';
import { sound } from '../services/sound';

interface LearnProps {
  onNavigate: (tab: string, levelId?: number) => void;
}

export const Learn: React.FC<LearnProps> = ({ onNavigate }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('algoritma');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const currentTopic =
    LEARNING_TOPICS.find((t) => t.id === selectedTopicId) || LEARNING_TOPICS[0];

  const handleTopicChange = (id: string) => {
    sound.playClick();
    setSelectedTopicId(id);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleSelectAnswer = (index: number) => {
    if (quizSubmitted) return;
    sound.playClick();
    setSelectedQuizAnswer(index);
  };

  const handleSubmitQuiz = () => {
    if (selectedQuizAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedQuizAnswer === currentTopic.quizQuestion.correctIndex) {
      sound.playVictory();
    } else {
      sound.playError();
    }
  };

  const getTopicIcon = (id: string) => {
    switch (id) {
      case 'algoritma':
        return <Layers className="w-4 h-4" />;
      case 'sequence':
        return <ArrowDownNarrowWide className="w-4 h-4" />;
      case 'loop':
        return <Repeat className="w-4 h-4" />;
      case 'condition':
        return <GitFork className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const getTargetLevelForTopic = (id: string): number => {
    switch (id) {
      case 'algoritma':
        return 1;
      case 'sequence':
        return 2;
      case 'loop':
        return 31;
      case 'condition':
        return 46;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Materi Dasar Pemrograman
        </h1>
        <p className="text-sm text-slate-500">
          Pahami 4 konsep fundamental logika algoritma sebelum kamu mempraktikkannya di medan petualangan.
        </p>
      </div>

      {/* Interactive Tabs / Segmented Control */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl gap-1 max-w-full overflow-x-auto shadow-inner">
          {LEARNING_TOPICS.map((topic) => {
            const isActive = topic.id === selectedTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => handleTopicChange(topic.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {getTopicIcon(topic.id)}
                <span>{topic.title.replace(/^\d+\.\s*/, '')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Topic Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Title and Summary */}
        <div className="border-b border-slate-100 pb-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Modul Pembelajaran
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            {currentTopic.title}
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            {currentTopic.summary}
          </p>
        </div>

        {/* Real-Life Analogy Box */}
        <div className="rounded-2xl bg-amber-50/70 border border-amber-200/60 p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 fill-amber-400 text-amber-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900 mb-1 font-display">
              Analogi di Kehidupan Sehari-hari
            </h3>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              {currentTopic.analogy}
            </p>
          </div>
        </div>

        {/* Conceptual Explanations */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-display">
            Penjelasan Konsep
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentTopic.explanation.map((para, pIdx) => (
              <div
                key={pIdx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold font-mono flex items-center justify-center mb-2">
                  {pIdx + 1}
                </div>
                <p>{para}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Blocks & Pseudocode side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visual Blocks Showcase */}
          <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50">
            <h4 className="text-sm font-bold text-slate-900 mb-3 font-display">
              Blok Perintah di Dalam Game
            </h4>
            <div className="space-y-2.5">
              {currentTopic.blockVisuals.map((bv, bIdx) => (
                <div
                  key={bIdx}
                  className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3"
                >
                  <div
                    className={`px-3 py-1.5 rounded-lg text-white font-bold text-xs whitespace-nowrap ${bv.color}`}
                  >
                    {bv.blockName}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {bv.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pseudocode / Logic Flow */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-slate-400 text-xs font-mono">
                <span>Contoh Alur Kode (Pseudocode)</span>
                <span>algoritma.txt</span>
              </div>
              <pre className="font-mono text-xs sm:text-sm text-sky-300 leading-relaxed whitespace-pre-wrap bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                {currentTopic.pseudocodeExample}
              </pre>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Siap mempraktikkan konsep ini?</span>
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('play', getTargetLevelForTopic(currentTopic.id));
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Coba di Level Permainan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Check-Your-Understanding Quiz */}
        <div className="rounded-2xl bg-blue-50/60 border border-blue-200/80 p-6 space-y-4">
          <div className="flex items-center gap-2 text-blue-900 font-display">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h4 className="text-base font-bold">Uji Pemahaman Singkat</h4>
          </div>

          <p className="text-sm font-semibold text-slate-800">
            {currentTopic.quizQuestion.question}
          </p>

          <div className="space-y-2">
            {currentTopic.quizQuestion.options.map((opt, oIdx) => {
              const isSelected = selectedQuizAnswer === oIdx;
              const isCorrect = oIdx === currentTopic.quizQuestion.correctIndex;

              let style = 'bg-white border-slate-200 text-slate-800 hover:border-blue-400';
              if (quizSubmitted) {
                if (isCorrect) {
                  style = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-red-50 border-red-300 text-red-800';
                }
              } else if (isSelected) {
                style = 'bg-blue-100/70 border-blue-600 text-blue-900 font-semibold';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectAnswer(oIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all duration-150 flex items-center justify-between cursor-pointer ${style}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold font-mono flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {quizSubmitted && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {!quizSubmitted ? (
              <button
                disabled={selectedQuizAnswer === null}
                onClick={handleSubmitQuiz}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs disabled:opacity-40 cursor-pointer shadow-xs transition-colors"
              >
                Periksa Jawaban
              </button>
            ) : (
              <div className="w-full bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                <strong>Penjelasan:</strong> {currentTopic.quizQuestion.explanation}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
