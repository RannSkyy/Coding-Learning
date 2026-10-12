/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Worlds } from './pages/Worlds';
import { GamePlay } from './pages/GamePlay';
import { DailyChallenge } from './pages/DailyChallenge';
import { Leaderboard } from './pages/Leaderboard';
import { About } from './pages/About';
import { StorageService } from './services/storage';
import { UserProgress } from './types';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() =>
    StorageService.getProgress()
  );
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);

  // Sync progress from local storage
  const refreshProgress = () => {
    const updated = StorageService.getProgress();
    setProgress(updated);
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  const totalStars = Object.values(progress.levelProgress).reduce(
    (sum, p) => sum + p.stars,
    0
  );

  const handleNavigate = (tab: string, levelId?: number) => {
    if (tab === 'play' && levelId) {
      setSelectedLevelId(levelId);
      setCurrentTab('play');
    } else {
      setCurrentTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    const newState = StorageService.toggleSound();
    setProgress((prev) => ({ ...prev, soundEnabled: newState }));
  };

  const handleUpdateName = (name: string) => {
    const updated = StorageService.setPlayerName(name);
    setProgress(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Bar following Top Bar Contract */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        totalXP={progress.totalXP}
        totalStars={totalStars}
        soundEnabled={progress.soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Arena */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <Home
            progress={progress}
            onNavigate={handleNavigate}
            onUpdateName={handleUpdateName}
          />
        )}

        {currentTab === 'learn' && <Learn onNavigate={handleNavigate} />}

        {currentTab === 'worlds' && (
          <Worlds
            progress={progress}
            onSelectLevel={(lvlId) => handleNavigate('play', lvlId)}
          />
        )}

        {currentTab === 'play' && (
          <GamePlay
            levelId={selectedLevelId}
            progress={progress}
            onBackToLevels={() => handleNavigate('worlds')}
            onNextLevel={(nextId) => {
              setSelectedLevelId(nextId);
            }}
            onRefreshProgress={refreshProgress}
          />
        )}

        {currentTab === 'daily' && (
          <DailyChallenge
            progress={progress}
            onBackToHome={() => handleNavigate('home')}
            onRefreshProgress={refreshProgress}
          />
        )}

        {currentTab === 'leaderboard' && (
          <Leaderboard
            progress={progress}
            onRefreshProgress={refreshProgress}
          />
        )}

        {currentTab === 'about' && <About />}
      </main>

      {/* Clean Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
