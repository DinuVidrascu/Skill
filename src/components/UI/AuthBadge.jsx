import React from 'react';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AuthBadge() {
  const { user, loginWithGoogle, logout, loading } = useAuth();

  if (loading) return <div className="animate-pulse w-24 h-8 bg-gray-100 rounded-lg"></div>;

  if (user) {
    return (
      <div className="flex items-center gap-3 bg-white p-1.5 pr-3 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.displayName} 
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full border border-gray-100 shadow-sm" 
            onError={(e) => e.target.style.display = 'none'}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <UserIcon size={16} />
          </div>
        )}
        <div className="hidden md:block">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Salut,</p>
          <p className="text-sm font-black text-gray-900 leading-none">{user.displayName.split(' ')[0]}</p>
        </div>
        <button 
          onClick={logout}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
          title="Deconectare"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={loginWithGoogle}
      className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold shadow-sm border border-indigo-100 transition-all text-sm cursor-pointer"
    >
      <LogIn size={16} className="text-indigo-600" /> 
      Conectează Cloud Sync
    </button>
  );
}
