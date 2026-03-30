import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useStats() {
  const [dailyStats, setDailyStats] = useLocalStorage('skillTrackerDaily', () => {
    return { date: new Date().toDateString(), xp: 0 };
  });

  const [streakData, setStreakData] = useLocalStorage('skillTrackerStreak', { 
    count: 0, 
    lastDate: null 
  });

  const updateDailyXP = useCallback((amount) => {
    setDailyStats(prev => {
      const today = new Date().toDateString();
      if (prev.date !== today) {
        return { date: today, xp: amount }; 
      }
      return { ...prev, xp: prev.xp + amount }; 
    });

    const todayStr = new Date().toDateString();
    setStreakData(prev => {
      if (prev.lastDate === todayStr) return prev; 
      if (!prev.lastDate) return { count: 1, lastDate: todayStr }; 

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const last = new Date(prev.lastDate);
      last.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return { count: prev.count + 1, lastDate: todayStr }; 
      } else {
        return { count: 1, lastDate: todayStr }; 
      }
    });
  }, [setDailyStats, setStreakData]);

  const currentStreak = useCallback(() => {
    if (!streakData.lastDate) return 0;
    const today = new Date(); today.setHours(0,0,0,0);
    const last = new Date(streakData.lastDate); last.setHours(0,0,0,0);
    const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0;
    return streakData.count;
  }, [streakData]);

  return {
    dailyStats,
    streakData,
    currentStreak: currentStreak(),
    updateDailyXP
  };
}
