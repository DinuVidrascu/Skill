import React, { useState } from 'react';
import { Trash2, Check, X } from 'lucide-react';
import { colorPalette } from '../../constants/colors';
import { availableIcons } from '../../constants/icons';

export default function SkillEditForm({ skill, onSave, onCancel, onDelete }) {
  const [formData, setFormData] = useState({
    name: skill.name,
    iconName: skill.iconName,
    color: skill.color || 'yellow'
  });

  return (
    <div className="flex flex-col p-4 bg-white border-2 border-gray-300 shadow-md ring-4 ring-gray-50 rounded-xl transition-all duration-200 h-full">
      <div className="flex flex-col h-full z-10 gap-3">
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full text-sm font-bold text-gray-900 border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Nume materie"
          autoFocus
        />
        
        <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-[88px] pb-1 pr-1 custom-scrollbar mb-2">
          {Object.keys(availableIcons).map(iconKey => {
            const IconOpt = availableIcons[iconKey];
            return (
              <button
                key={iconKey}
                onClick={() => setFormData({ ...formData, iconName: iconKey })}
                className={`p-1.5 rounded-md flex-shrink-0 transition-colors cursor-pointer ${formData.iconName === iconKey ? 'bg-indigo-100 text-indigo-700 shadow-inner' : 'bg-gray-50 text-gray-400 hover:bg-gray-200'}`}
              >
                <IconOpt size={18} />
              </button>
            );
          })}
        </div>

        {/* Color Selector */}
        <div className="flex flex-wrap gap-2 mb-2 pt-2 border-t border-gray-100">
          {Object.keys(colorPalette).map(colorKey => {
            const isSelected = formData.color === colorKey;
            return (
              <button
                key={colorKey}
                onClick={() => setFormData({ ...formData, color: colorKey })}
                className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${isSelected ? 'scale-110 border-gray-900 shadow-md' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: colorPalette[colorKey].hex }}
                title={colorKey}
              />
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
          <button 
            onClick={onDelete} 
            className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors cursor-pointer" 
            title="Șterge materia"
          >
            <Trash2 size={16} />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={onCancel} 
              className="text-gray-500 hover:bg-gray-100 px-2 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer"
            >
              Anulează
            </button>
            <button 
              onClick={() => onSave(formData)} 
              className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md text-xs font-bold shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Check size={14} /> Salvează
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
