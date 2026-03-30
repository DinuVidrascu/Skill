import { useState, useCallback, useEffect } from 'react';

export function useTimer(onSaveXP) {
  const [activeTimer, setActiveTimer] = useState({ 
    skillId: null, 
    startTime: null, 
    seconds: 0, 
    isRunning: false 
  });

  useEffect(() => {
    let interval;
    if (activeTimer.isRunning && activeTimer.startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - activeTimer.startTime) / 1000);
        setActiveTimer(prev => ({ ...prev, seconds: elapsedSeconds }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer.isRunning, activeTimer.startTime]);

  const startSession = useCallback((skillId) => {
    if (activeTimer.isRunning && activeTimer.skillId === skillId) return; 
    
    // Auto-save if switching skills
    if (activeTimer.isRunning) {
      stopAndSaveSession();
    }
    setActiveTimer({ 
      skillId, 
      startTime: Date.now(), 
      seconds: 0, 
      isRunning: true 
    });
  }, [activeTimer, onSaveXP]);

  const stopAndSaveSession = useCallback(() => {
    if (!activeTimer.skillId || activeTimer.seconds === 0) {
      setActiveTimer({ skillId: null, startTime: null, seconds: 0, isRunning: false });
      return;
    }
    const earnedXP = Math.floor(activeTimer.seconds / 10);
    onSaveXP(activeTimer.skillId, earnedXP, activeTimer.seconds);
    setActiveTimer({ skillId: null, startTime: null, seconds: 0, isRunning: false });
  }, [activeTimer, onSaveXP]);

  const cancelSession = useCallback(() => {
    setActiveTimer({ skillId: null, startTime: null, seconds: 0, isRunning: false });
  }, []);

  return {
    activeTimer,
    startSession,
    stopAndSaveSession,
    cancelSession
  };
}
