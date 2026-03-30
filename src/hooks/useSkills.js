import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { db } from '../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './useAuth';

const initialSkillsData = [];

export function useSkills() {
  const { user } = useAuth();
  const [skills, setSkills] = useLocalStorage('skillTrackerProgres_v2', initialSkillsData);
  const [activityLog, setActivityLog] = useLocalStorage('skillTrackerHistory_v2', []);

  // 1. Efect pentru încărcarea datelor din Firestore la login
  useEffect(() => {
    if (!user || !db) return;

    const userRef = doc(db, 'users', user.uid);
    
    // Ascultăm schimbările în timp real din Firestore
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        if (cloudData.skills) setSkills(cloudData.skills);
        if (cloudData.history) setActivityLog(cloudData.history);
      } else {
        // Dacă e un utilizator nou în Firestore, încărcăm datele locale în cloud
        setDoc(userRef, { 
          skills, 
          history: activityLog,
          lastSync: Date.now() 
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Funcție pentru salvarea în Firestore (invocată la schimbări)
  const syncToCloud = useCallback(async (newSkills, newHistory) => {
    if (!user || !db) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { 
        skills: newSkills, 
        history: newHistory,
        lastSync: Date.now() 
      }, { merge: true });
    } catch (error) {
      console.error("Cloud Sync Error:", error);
    }
  }, [user]);

  const addXP = useCallback((skillId, amount, timeAmount = 0) => {
    let nextSkills;
    let nextHistory = activityLog;

    setSkills(prev => {
      nextSkills = prev.map(skill => {
        if (skill.id === skillId) {
          return { 
            ...skill, 
            xp: skill.xp + amount, 
            timeSpent: (skill.timeSpent || 0) + timeAmount, 
            lastActive: Date.now() 
          };
        }
        return skill;
      });
      return nextSkills;
    });
    
    if (amount > 0 || timeAmount > 0) {
      const targetSkill = skills.find(s => s.id === skillId);
      if (targetSkill) {
        const newLog = {
          id: 'log_' + Date.now() + Math.random().toString(36).substr(2, 9),
          skillName: targetSkill.name,
          iconName: targetSkill.iconName,
          color: targetSkill.color,
          xpAdded: amount,
          timeSpent: timeAmount,
          timestamp: Date.now()
        };
        setActivityLog(prev => {
          nextHistory = [newLog, ...prev].slice(0, 50);
          return nextHistory;
        });
      }
    }

    // Sincronizare Cloud
    if (nextSkills) syncToCloud(nextSkills, nextHistory);
  }, [skills, activityLog, syncToCloud]);

  const updateSkill = useCallback((id, data) => {
    setSkills(prev => {
      const next = prev.map(skill => skill.id === id ? { ...skill, ...data } : skill);
      syncToCloud(next, activityLog);
      return next;
    });
  }, [activityLog, syncToCloud]);

  const deleteSkill = useCallback((id) => {
    setSkills(prev => {
      const next = prev.filter(skill => skill.id !== id);
      syncToCloud(next, activityLog);
      return next;
    });
  }, [activityLog, syncToCloud]);

  const resetSkillProgress = useCallback((id) => {
    setSkills(prev => {
      const next = prev.map(skill => skill.id === id ? { ...skill, xp: 0, timeSpent: 0 } : skill);
      syncToCloud(next, activityLog);
      return next;
    });
  }, [activityLog, syncToCloud]);

  const addSkill = useCallback((name = 'Materie Nouă', iconName = 'BookOpen', color = 'blue') => {
    const newSkill = {
      id: 'skill_' + Date.now(), 
      name, 
      iconName, 
      color, 
      xp: 0, 
      timeSpent: 0, 
      lastActive: Date.now()
    };
    setSkills(prev => {
      const next = [...prev, newSkill];
      syncToCloud(next, activityLog);
      return next;
    });
    return newSkill;
  }, [activityLog, syncToCloud]);

  const clearHistory = useCallback(() => {
    setActivityLog(prev => {
      syncToCloud(skills, []);
      return [];
    });
  }, [skills, syncToCloud]);

  return {
    skills,
    activityLog,
    addXP,
    updateSkill,
    deleteSkill,
    resetSkillProgress,
    addSkill,
    clearHistory
  };
}
