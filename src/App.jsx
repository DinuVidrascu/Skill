import React, { useState, useMemo, useEffect } from 'react';
import { 
  Flame, BellRing, Download, ChevronDown, Clock, Square, Plus, 
  Award, Target, TrendingUp, Code2
} from 'lucide-react';

import { useSkills } from './hooks/useSkills';
import { useStats } from './hooks/useStats';
import { useTimer } from './hooks/useTimer';
import { usePWA } from './hooks/usePWA';
import { colorPalette } from './constants/colors';
import { availableIcons } from './constants/icons';
import { getLevel, formatTime } from './utils/format';

import Modal from './components/UI/Modal';
import Toast from './components/UI/Toast';
import StatsCard from './components/Dashboard/StatsCard';
import AchievementsList from './components/Achievements/AchievementsList';
import SkillCard from './components/Skills/SkillCard';
import SkillEditForm from './components/Skills/SkillEditForm';
import HistoryList from './components/History/HistoryList';
import AuthBadge from './components/UI/AuthBadge';

export default function App() {
  const { 
    skills, activityLog, addXP, updateSkill, deleteSkill, resetSkillProgress, addSkill, clearHistory 
  } = useSkills();
  
  const { dailyStats, streakData, currentStreak, updateDailyXP } = useStats();
  
  const { activeTimer, startSession, stopAndSaveSession } = useTimer((id, xp, time) => {
    addXP(id, xp, time);
    updateDailyXP(xp);
  });
  
  const { 
    deferredPrompt, notifyPermission, memento, setMemento, handleInstallPWA, 
    requestNotificationPermission, showMemento 
  } = usePWA();

  const [sortBy, setSortBy] = useState('progress');
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, skillId: null, title: '', message: '' });

  // Notifications Logic
  useEffect(() => {
    const todayStr = new Date().toDateString();
    if (dailyStats.date !== todayStr || dailyStats.xp < 300) {
      const timeoutId = setTimeout(() => {
        let title = "Timpul pentru studiu!";
        let message = "Nu uita de obiectivul tău de azi. Hai să adunăm niște XP!";
        let type = "info";

        if (streakData.lastDate && streakData.lastDate !== todayStr) {
          const today = new Date(); today.setHours(0,0,0,0);
          const last = new Date(streakData.lastDate); last.setHours(0,0,0,0);
          const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            title = "Atenție la Streak! 🔥";
            message = "Flacăra ta s-ar putea stinge! Fă măcar 10 XP azi pentru a o menține.";
            type = "warning";
          }
        }
        showMemento(title, message, type);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [dailyStats.date, dailyStats.xp, streakData.lastDate, showMemento]);

  // Sorting
  const sortedSkills = useMemo(() => {
    return [...skills].sort((a, b) => {
      if (sortBy === 'progress') {
        if (b.xp === a.xp) return a.name.localeCompare(b.name);
        return b.xp - a.xp;
      }
      if (sortBy === 'recent') {
        if (b.lastActive === a.lastActive) return a.name.localeCompare(b.name);
        return b.lastActive - a.lastActive;
      }
      if (sortBy === 'alpha') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [skills, sortBy]);

  // Derived Stats
  const totalXP = skills.reduce((acc, s) => acc + s.xp, 0);
  const overallLevel = Math.floor(totalXP / 500) + 1;
  const topSkill = [...skills].sort((a, b) => b.xp - a.xp)[0];
  const dailyGoal = 300;
  const dailyProgressPct = Math.min((dailyStats.xp / dailyGoal) * 100, 100);
  const activeSkill = activeTimer.skillId ? skills.find(s => s.id === activeTimer.skillId) : null;

  const chartMaxXP = useMemo(() => {
    let highest = skills.length > 0 ? Math.max(...skills.map(s => s.xp)) : 0;
    if (activeTimer.isRunning && activeSkill) {
      const potentialXP = activeSkill.xp + Math.floor(activeTimer.seconds / 10);
      if (potentialXP > highest) highest = potentialXP;
    }
    return highest > 1000 ? Math.ceil(highest / 500) * 500 : 1000;
  }, [skills, activeTimer, activeSkill]);

  // Handlers
  const handleConfirmAction = () => {
    const { type, skillId } = modalConfig;
    if (type === 'delete') {
      deleteSkill(skillId);
      setEditingSkillId(null);
    } else if (type === 'reset') {
      resetSkillProgress(skillId);
    } else if (type === 'clearHistory') {
      clearHistory();
    }
    setModalConfig({ isOpen: false, type: null, skillId: null, title: '', message: '' });
  };

  const handleManualAddXP = (id, amount) => {
    addXP(id, amount);
    updateDailyXP(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center items-start font-sans">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Overview <span className="text-gray-400 font-medium">/ Skills</span>
            </h1>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm border shadow-sm transition-all ${currentStreak > 0 ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
              <Flame size={18} className={currentStreak > 0 ? "animate-pulse-fast text-orange-500" : ""} fill={currentStreak > 0 ? "currentColor" : "none"} strokeWidth={currentStreak > 0 ? 0 : 2} />
              <span>{currentStreak} {currentStreak === 1 ? 'Zi' : 'Zile'}</span>
            </div>
            
            <div className="ml-0 sm:ml-4">
              <AuthBadge />
            </div>
          </div>
          
          <div className="flex items-center gap-3 z-20 flex-wrap">
            {notifyPermission !== 'granted' && (
              <button onClick={requestNotificationPermission} className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg font-bold shadow-sm transition-all text-sm border border-yellow-200 cursor-pointer">
                <BellRing size={16} /> Activează Notificările
              </button>
            )}

            {deferredPrompt && (
              <button onClick={handleInstallPWA} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-all text-sm cursor-pointer">
                <Download size={16} /> Instalează Aplicatia
              </button>
            )}

            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-gray-700 font-medium py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
              >
                <option value="progress">Cea mai mare progresie</option>
                <option value="recent">Accesate recent</option>
                <option value="alpha">Alfabetic</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown size={16} strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Dash Rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <StatsCard 
            title="Nivel General" 
            value={`Lvl ${overallLevel}`} 
            subtitle={`${totalXP} XP Total Acumulat`} 
            icon={Award} 
            gradient="from-indigo-600 to-purple-700" 
          />
          
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Target size={18} className="text-blue-500"/>
              <span className="text-xs font-bold uppercase tracking-widest">Obiectiv Zilnic</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-3 mt-1">
                <div className="text-4xl font-black text-gray-900">{dailyStats.xp}</div>
                <div className="text-sm font-bold text-gray-400">/ {dailyGoal} XP</div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                <div className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${dailyProgressPct >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${dailyProgressPct}%` }}></div>
              </div>
              <div className="text-xs text-right font-semibold text-gray-400">
                {dailyProgressPct >= 100 ? '🎉 Obiectiv atins!' : `${dailyGoal - dailyStats.xp} XP rămași`}
              </div>
            </div>
          </div>

          <StatsCard 
            title="Materia de Top" 
            value={topSkill?.name || 'Nicio materie'} 
            subtitle={`Lvl ${getLevel(topSkill?.xp || 0)} • ${topSkill?.xp || 0} XP`} 
            icon={TrendingUp} 
            colorClass="text-orange-500"
          />
        </div>

        <AchievementsList achievementData={{ totalXP, streak: currentStreak, skills, dailyXP: dailyStats.xp }} />

        {/* Active Session Banner */}
        {activeTimer.isRunning && (
          <div className="mb-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Clock className="text-blue-600 animate-spin-slow" size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">Sesiune activă în curs</p>
                <p className="text-xl font-black text-gray-900">{activeSkill?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-4xl font-mono font-black text-blue-700 tracking-tight">
                {formatTime(activeTimer.seconds)}
              </div>
              <button 
                onClick={stopAndSaveSession}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Square size={16} fill="currentColor" /> Salvează XP
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Chart Column */}
          <div className="lg:col-span-5 relative pl-1 mt-2">
            <div className="absolute top-0 bottom-6 left-10 right-0 flex justify-between z-0 pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-full border-l border-dashed border-gray-200" />
              ))}
            </div>

            <div className="relative z-10 flex flex-col gap-6 pb-8">
              {sortedSkills.map((skill) => {
                const Icon = availableIcons[skill.iconName] || Code2;
                const isThisActive = activeTimer.isRunning && activeTimer.skillId === skill.id;
                const totalDisplayXP = skill.xp + (isThisActive ? Math.floor(activeTimer.seconds / 10) : 0);

                return (
                  <div key={`chart-${skill.id}`} className="flex items-center gap-4 h-6 group">
                    <div className="w-6 flex justify-center text-gray-400 group-hover:text-gray-600 transition-colors">
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <div className="flex-1 relative h-3 flex items-center">
                      {totalDisplayXP > 0 && (
                        <div 
                          className="absolute left-0 h-3 border-2 border-gray-900 rounded-full transition-all duration-300 ease-out shadow-sm"
                          style={{ width: `${Math.max((totalDisplayXP / chartMaxXP) * 100, 1)}%`, backgroundColor: colorPalette[skill.color || 'yellow'].hex }}
                        ></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[11px] font-bold text-gray-400">
              <span>0</span>
              <span>{chartMaxXP * 0.25}</span>
              <span>{chartMaxXP * 0.5}</span>
              <span>{chartMaxXP * 0.75}</span>
              <span>{chartMaxXP >= 1000 ? `${chartMaxXP/1000}K` : chartMaxXP}</span>
            </div>
          </div>

          {/* Cards Column */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortedSkills.map((skill) => {
                const isEditing = editingSkillId === skill.id;
                const isActive = activeTimer.isRunning && activeTimer.skillId === skill.id;
                
                if (isEditing) {
                  return (
                    <SkillEditForm 
                      key={`edit-${skill.id}`}
                      skill={skill}
                      onSave={(data) => {
                        updateSkill(skill.id, data);
                        setEditingSkillId(null);
                      }}
                      onCancel={() => setEditingSkillId(null)}
                      onDelete={() => setModalConfig({ isOpen: true, type: 'delete', skillId: skill.id, title: 'Ștergere materie', message: 'Ești sigur că vrei să ștergi complet această materie? Acțiunea este ireversibilă.' })}
                    />
                  );
                }

                return (
                  <SkillCard 
                    key={`card-${skill.id}`}
                    skill={skill}
                    isActive={isActive}
                    activeSeconds={activeTimer.seconds}
                    onStart={() => startSession(skill.id)}
                    onStop={stopAndSaveSession}
                    onAddXP={(amt) => handleManualAddXP(skill.id, amt)}
                    onEdit={() => setEditingSkillId(skill.id)}
                    onReset={() => setModalConfig({ isOpen: true, type: 'reset', skillId: skill.id, title: 'Resetare progres', message: 'Ești sigur că vrei să resetezi la zero tot progresul și timpul pentru această materie?' })}
                  />
                );
              })}
              
              <button 
                onClick={() => {
                  const newSkill = addSkill();
                  setEditingSkillId(newSkill.id);
                }}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl transition-all duration-200 min-h-[140px] text-gray-400 hover:text-indigo-600 cursor-pointer"
              >
                <Plus size={32} />
                <span className="font-bold text-sm">Adaugă Materie Nouă</span>
              </button>
            </div>
          </div>
        </div>

        <HistoryList 
          activityLog={activityLog} 
          onClear={() => setModalConfig({ isOpen: true, type: 'clearHistory', skillId: null, title: 'Ștergere Istoric', message: 'Ești sigur că vrei să ștergi tot jurnalul de activități?' })} 
        />
      </div>

      <Modal 
        {...modalConfig} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} 
        onConfirm={handleConfirmAction} 
      />
      
      <Toast memento={memento} onClose={() => setMemento(null)} />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes pulse-fast {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        .animate-pulse-fast {
          animation: pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}} />
    </div>
  );
}
