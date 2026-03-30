import React from 'react';
import { History, Trash2, Code2, Clock } from 'lucide-react';
import { colorPalette } from '../../constants/colors';
import { availableIcons } from '../../constants/icons';
import { formatTotalTime } from '../../utils/format';

export default function HistoryList({ activityLog, onClear }) {
  return (
    <div className="mt-12 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <History className="text-indigo-500" size={20} /> Jurnal de Activitate
        </h2>
        {activityLog.length > 0 && (
          <button 
            onClick={onClear} 
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-lg cursor-pointer"
            title="Șterge istoricul"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Șterge istoricul</span>
          </button>
        )}
      </div>

      {activityLog.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 font-medium">
          Nicio activitate înregistrată încă. Pornește cronometrul sau adaugă XP rapid!
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-2">
            {activityLog.map((log) => {
              const Icon = availableIcons[log.iconName] || Code2;
              const logColor = colorPalette[log.color || 'yellow'];
              const dateObj = new Date(log.timestamp);
              const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const dateString = dateObj.toLocaleDateString();

              return (
                <div key={log.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0 group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${logColor.bg} ${logColor.text}`}>
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{log.skillName}</p>
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        {dateString} la {timeString}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    {log.timeSpent > 0 && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                        <Clock size={12} />
                        {formatTotalTime(log.timeSpent)}
                      </div>
                    )}
                    <div className={`text-sm font-black ${logColor.text} bg-white px-2.5 py-1 rounded-md shadow-sm border ${logColor.border}`}>
                      +{log.xpAdded} XP
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
