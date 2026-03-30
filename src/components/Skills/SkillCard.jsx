import React from 'react';
import { Clock, Zap, Square, Play, RotateCcw, Edit2, Code2 } from 'lucide-react';
import { colorPalette } from '../../constants/colors';
import { availableIcons } from '../../constants/icons';
import { getLevel, getLevelProgress, formatTotalTime } from '../../utils/format';

export default function SkillCard({
  skill,
  isActive,
  isEditing,
  onStart,
  onStop,
  onAddXP,
  onEdit,
  onReset,
  activeSeconds
}) {
  const Icon = availableIcons[skill.iconName] || Code2;
  const activeSessionXP = isActive ? Math.floor(activeSeconds / 10) : 0;
  const activeSessionTime = isActive ? activeSeconds : 0;
  const totalXP = skill.xp + activeSessionXP;
  const totalTime = (skill.timeSpent || 0) + activeSessionTime;

  const skillColor = colorPalette[skill.color || 'yellow'];

  return (
    <div
      className={`flex flex-col p-4 bg-white border-2 ${isActive ? `${skillColor.border} shadow-md ring-4 ${skillColor.ring}` : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'} rounded-xl transition-all duration-200 group relative overflow-hidden`}
    >
      {/* Quick Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-20 bg-white/95 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-gray-50">
        <button
          onClick={onReset}
          className="p-1.5 bg-white border border-gray-200 text-gray-400 hover:text-orange-500 hover:border-orange-200 rounded-md shadow-sm transition-colors flex items-center justify-center cursor-pointer"
          title="Resetează progresul la zero"
        >
          <RotateCcw size={14} />
        </button>
        <button
          onClick={onEdit}
          className="p-1.5 bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-200 rounded-md shadow-sm transition-colors flex items-center justify-center cursor-pointer"
          title="Editează materia"
        >
          <Edit2 size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between z-10 mb-3 gap-3 w-full">
        <div className={`flex-shrink-0 ${isActive ? `${skillColor.text} ${skillColor.bg}` : 'text-gray-500 bg-gray-50'} p-2.5 rounded-lg transition-colors`}>
          <Icon size={22} strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-2">
            <span className="font-bold text-gray-900 block leading-tight truncate">{skill.name}</span>
            <div className="flex-shrink-0">
              <div className={`text-[12px] font-black ${skillColor.text} ${skillColor.bg} px-2.5 py-1 rounded-md shadow-sm whitespace-nowrap`}>
                LVL {getLevel(totalXP)}
              </div>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1">
            <span className="text-[13px] font-bold text-gray-400 font-mono">{totalXP} XP</span>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <span className="text-[12px] font-medium text-gray-400 flex items-center gap-1 whitespace-nowrap">
              <Clock size={11} /> {formatTotalTime(totalTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar to next level */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4 overflow-hidden z-10">
        <div
          className="h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${getLevelProgress(totalXP)}%`, backgroundColor: isActive ? skillColor.hex : '#818CF8' }}
        ></div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-auto z-10">
        <div className="flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onAddXP(10)}
            className="text-[11px] font-bold bg-gray-100 hover:bg-yellow-100 text-gray-600 hover:text-yellow-700 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            title="Adaugă 10 XP rapid"
          >
            <Zap size={12} fill="currentColor" /> 10
          </button>
          <button
            onClick={() => onAddXP(50)}
            className="text-[11px] font-bold bg-gray-100 hover:bg-yellow-100 text-gray-600 hover:text-yellow-700 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            title="Adaugă 50 XP rapid"
          >
            <Zap size={12} fill="currentColor" /> 50
          </button>
        </div>

        <div>
          {isActive ? (
            <button
              onClick={onStop}
              className="text-xs flex items-center gap-1.5 text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Square size={12} fill="currentColor" /> Stop
            </button>
          ) : (
            <button
              onClick={onStart}
              className="text-xs flex items-center gap-1.5 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md font-bold shadow-sm transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
            >
              <Play size={12} fill="currentColor" /> Start
            </button>
          )}
        </div>
      </div>

      {/* Background decoration for active card */}
      {isActive && (
        <div className={`absolute inset-0 ${skillColor.bg} opacity-40 z-0`}></div>
      )}
    </div>
  );
}
