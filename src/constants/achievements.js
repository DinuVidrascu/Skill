import { 
  Star, Target, Flame, Zap, Clock, Activity, Compass, Medal, Crown, Award 
} from 'lucide-react';

export const ACHIEVEMENTS = [
  { 
    id: 'first_blood', title: 'Primul Pas', desc: 'Acumulează primii tăi 10 XP', 
    icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100', border: 'border-yellow-200',
    condition: (data) => data.totalXP >= 10 
  },
  { 
    id: 'daily_goal', title: 'Campion Zilnic', desc: 'Atinge obiectivul zilnic (300 XP)', 
    icon: Target, color: 'text-green-500', bg: 'bg-green-100', border: 'border-green-200',
    condition: (data) => data.dailyXP >= 300 
  },
  { 
    id: 'streak_3', title: 'Consecvent', desc: 'Menține un streak de 3 zile', 
    icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-200',
    condition: (data) => data.streak >= 3 
  },
  { 
    id: 'streak_7', title: 'Săptămână Perfectă', desc: 'Menține un streak de 7 zile', 
    icon: Zap, color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-200',
    condition: (data) => data.streak >= 7 
  },
  { 
    id: 'marathon', title: 'Maratonist', desc: 'Petrece 2+ ore la o materie', 
    icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200',
    condition: (data) => data.skills.some(s => (s.timeSpent || 0) >= 7200) 
  },
  { 
    id: 'time_lord', title: 'Stăpânul Timpului', desc: 'Acumulează 10+ ore studiate în total', 
    icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-100', border: 'border-indigo-200',
    condition: (data) => data.skills.reduce((acc, s) => acc + (s.timeSpent || 0), 0) >= 36000 
  },
  { 
    id: 'explorer', title: 'Explorator', desc: 'Adaugă 10 materii diferite în panou', 
    icon: Compass, color: 'text-teal-500', bg: 'bg-teal-100', border: 'border-teal-200',
    condition: (data) => data.skills.length >= 10 
  },
  { 
    id: 'polymath', title: 'Polimat', desc: 'Ai 5 materii la Nivelul 2+', 
    icon: Medal, color: 'text-emerald-500', bg: 'bg-emerald-100', border: 'border-emerald-200',
    condition: (data) => data.skills.filter(s => s.xp >= 100).length >= 5 
  },
  { 
    id: 'master', title: 'Specialist', desc: 'Atinge Nivelul 10 la o materie', 
    icon: Crown, color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-200',
    condition: (data) => data.skills.some(s => s.xp >= 900)
  },
  { 
    id: 'legend', title: 'Legenda XP', desc: 'Acumulează 5000 XP în total', 
    icon: Award, color: 'text-pink-500', bg: 'bg-pink-100', border: 'border-pink-200',
    condition: (data) => data.totalXP >= 5000 
  },
];
