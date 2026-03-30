import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, gradient, colorClass }) {
  if (gradient) {
    return (
      <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-md relative overflow-hidden group hover:shadow-lg transition-all duration-300`}>
        <div className="absolute -top-6 -right-6 text-white opacity-10 group-hover:scale-110 transition-transform duration-500">
          <Icon size={140} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-100 mb-3">
            <Icon size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
          </div>
          <div className="text-5xl font-black mb-1 drop-shadow-sm">{value}</div>
          <div className="text-sm text-indigo-200 font-medium">{subtitle}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center text-gray-500 mb-2">
        <div className="flex items-center gap-2">
          <Icon size={18} className={colorClass || "text-blue-500"}/>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</span>
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-2 mb-3 mt-1">
          <div className="text-4xl font-black text-gray-900">{value}</div>
          {subtitle && <div className="text-sm font-bold text-gray-400">{subtitle}</div>}
        </div>
        {/* Progress bar logic could be here, but let's keep it generic */}
      </div>
    </div>
  );
}
