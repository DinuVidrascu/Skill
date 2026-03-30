import React from 'react';
import { X, AlertTriangle, Bell } from 'lucide-react';

export default function Toast({ memento, onClose }) {
  if (!memento) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`bg-white border-2 rounded-xl shadow-2xl p-4 pr-12 max-w-xs relative ${memento.type === 'warning' ? 'border-orange-400' : 'border-indigo-400'}`}>
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-200 rounded-md p-1 transition-colors"
        >
          <X size={14} strokeWidth={3} />
        </button>
        <div className="flex gap-3 items-start">
          <div className={`p-2 rounded-lg flex-shrink-0 ${memento.type === 'warning' ? 'bg-orange-100 text-orange-500' : 'bg-indigo-100 text-indigo-500'}`}>
            {memento.type === 'warning' ? <AlertTriangle size={20} strokeWidth={2.5} /> : <Bell size={20} strokeWidth={2.5} />}
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">{memento.title}</h4>
            <p className="text-xs font-medium text-gray-500 mt-1 leading-tight">{memento.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
