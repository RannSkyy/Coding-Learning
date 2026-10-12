import { UserProgress, LevelProgress } from '../types';
import { sound } from './sound';

const STORAGE_KEY = 'coding_for_kids_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  playerName: 'Siswa Juara',
  totalXP: 0,
  levelProgress: {},
  unlockedWorlds: [1], // World 1 unlocked by default
  achievements: [],
  soundEnabled: true,
  lastPlayedLevelId: 1,
};

export class StorageService {
  public static getProgress(): UserProgress {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_PROGRESS;
      const parsed = JSON.parse(data) as UserProgress;
      // sync sound
      sound.setEnabled(parsed.soundEnabled ?? true);
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        levelProgress: parsed.levelProgress || {},
        unlockedWorlds: parsed.unlockedWorlds || [1],
        achievements: parsed.achievements || [],
      };
    } catch {
      return DEFAULT_PROGRESS;
    }
  }

  public static saveProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (err) {
      console.error('Failed to save progress', err);
    }
  }

  public static updateLevelResult(
    levelId: number,
    stars: number,
    blocksCount: number,
    earnedXP: number
  ): {
    updatedProgress: UserProgress;
    newAchievements: string[];
    newUnlockedWorlds: number[];
  } {
    const current = this.getProgress();
    const existing = current.levelProgress[levelId];

    const bestStars = existing ? Math.max(existing.stars, stars) : stars;
    const bestBlocks = existing
      ? Math.min(existing.bestBlocksCount, blocksCount)
      : blocksCount;

    const newLevelProgress: LevelProgress = {
      levelId,
      stars: bestStars,
      bestBlocksCount: bestBlocks,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    const isFirstTimeCompleted = !existing?.completed;
    const additionalXP = isFirstTimeCompleted
      ? earnedXP
      : stars > (existing?.stars || 0)
      ? Math.round(earnedXP * 0.5)
      : 0;

    const updatedLevelProgress = {
      ...current.levelProgress,
      [levelId]: newLevelProgress,
    };

    // Calculate total stars
    const totalStars = Object.values(updatedLevelProgress).reduce(
      (sum, p) => sum + p.stars,
      0
    );

    // Calculate completed levels count
    const completedCount = Object.values(updatedLevelProgress).filter(
      (p) => p.completed
    ).length;

    // Check unlocking worlds:
    // World 1: 0 stars (always unlocked)
    // World 2: 12 stars
    // World 3: 28 stars
    // World 4: 45 stars
    // World 5: 65 stars
    const newUnlockedWorlds: number[] = [...current.unlockedWorlds];
    const worldUnlockCriteria: Record<number, number> = {
      2: 12,
      3: 28,
      4: 45,
      5: 65,
    };

    Object.entries(worldUnlockCriteria).forEach(([worldIdStr, reqStars]) => {
      const wId = Number(worldIdStr);
      if (totalStars >= reqStars && !newUnlockedWorlds.includes(wId)) {
        newUnlockedWorlds.push(wId);
      }
    });

    // Check Achievements
    const newAchievements: string[] = [];
    const checkAchievement = (id: string, condition: boolean) => {
      if (condition && !current.achievements.includes(id)) {
        newAchievements.push(id);
      }
    };

    checkAchievement('first_win', completedCount >= 1);
    checkAchievement('levels_10', completedCount >= 10);
    checkAchievement('levels_30', completedCount >= 30);
    checkAchievement('levels_50', completedCount >= 50);
    checkAchievement('master_80', completedCount >= 80);

    const perfectCount = Object.values(updatedLevelProgress).filter(
      (p) => p.stars === 3
    ).length;
    checkAchievement('perfect_run_10', perfectCount >= 10);
    checkAchievement('perfect_run_30', perfectCount >= 30);

    const finalAchievements = [...current.achievements, ...newAchievements];
    const achievementBonusXP = newAchievements.length * 100;

    const updatedProgress: UserProgress = {
      ...current,
      totalXP: current.totalXP + additionalXP + achievementBonusXP,
      levelProgress: updatedLevelProgress,
      unlockedWorlds: newUnlockedWorlds,
      achievements: finalAchievements,
      lastPlayedLevelId: levelId,
    };

    this.saveProgress(updatedProgress);
    return { updatedProgress, newAchievements, newUnlockedWorlds };
  }

  public static setPlayerName(name: string): UserProgress {
    const current = this.getProgress();
    const updated = { ...current, playerName: name.trim() || 'Siswa Juara' };
    this.saveProgress(updated);
    return updated;
  }

  public static toggleSound(): boolean {
    const current = this.getProgress();
    const newState = !current.soundEnabled;
    const updated = { ...current, soundEnabled: newState };
    sound.setEnabled(newState);
    this.saveProgress(updated);
    return newState;
  }

  public static resetAllProgress(): UserProgress {
    this.saveProgress(DEFAULT_PROGRESS);
    return DEFAULT_PROGRESS;
  }
}
