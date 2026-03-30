import React from 'react';
import { Trophy, Check, Lock } from 'lucide-react';
import { ACHIEVEMENTS } from '../../constants/achievements';

export default function AchievementsList({ achievementData }) {
  const unlockedCount = ACHIEVEMENTS.filter(ach => ach.condition(achievementData)).length;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="text-yellow-500" size={20} /> Trofee & Realizări
        </h2>
        <div className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {unlockedCount} / {ACHIEVEMENTS.length}
        </div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = ach.condition(achievementData);
          const AchIcon = ach.icon;

          return (
            <div 
              key={`ach-${ach.id}`}
              className={`flex items-center gap-4 min-w-[260px] p-4 rounded-xl border-2 transition-all snap-start ${
                isUnlocked 
                  ? `bg-white ${ach.border} shadow-sm hover:shadow-md` 
                  : 'bg-gray-50 border-gray-100 opacity-70 grayscale hover:grayscale-0'
              }`}
            >
              <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isUnlocked ? ach.bg + ' ' + ach.color : 'bg-gray-200 text-gray-400'}`}>
                <AchIcon size={24} />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${isUnlocked ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                  {isUnlocked ? <Check size={12} strokeWidth={3} /> : <Lock size={10} strokeWidth={3} />}
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-black ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>{ach.title}</h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5 leading-tight">{ach.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
