import React from 'react';
import { CommercialStats } from '../types';
import { Trophy, TrendingUp, Medal } from 'lucide-react';

interface PodiumProps {
  top3: CommercialStats[];
}

const PodiumItem: React.FC<{ 
  stats: CommercialStats; 
  rank: 1 | 2 | 3; 
}> = ({ stats, rank }) => {
  
  let heightClass = '';
  let colorClass = '';
  let scaleClass = '';
  let borderClass = '';
  let orderClass = '';

  // Visual configuration based on rank - Neutral/Premium look
  if (rank === 1) {
    heightClass = 'h-64';
    colorClass = 'bg-gradient-to-b from-yellow-600/20 to-neutral-900'; // Gold tint
    borderClass = 'border-yellow-600/50';
    scaleClass = 'scale-110 z-10';
    orderClass = 'order-2'; 
  } else if (rank === 2) {
    heightClass = 'h-48';
    colorClass = 'bg-gradient-to-b from-neutral-400/20 to-neutral-900'; // Silver tint
    borderClass = 'border-neutral-400/50';
    scaleClass = 'scale-100 z-0';
    orderClass = 'order-1';
  } else {
    heightClass = 'h-40';
    colorClass = 'bg-gradient-to-b from-orange-700/20 to-neutral-900'; // Bronze tint
    borderClass = 'border-orange-700/50';
    scaleClass = 'scale-95 z-0';
    orderClass = 'order-3'; 
  }

  const formattedRevenue = new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(stats.totalRevenue);

  return (
    <div className={`flex flex-col items-center justify-end ${orderClass} ${scaleClass} transition-all duration-500 mx-2`}>
      {/* Avatar / Info Bubble */}
      <div className="mb-4 flex flex-col items-center animate-fade-in-up">
        <div className="relative">
             <div className={`w-20 h-20 rounded-full border-2 ${rank === 1 ? 'border-yellow-500' : rank === 2 ? 'border-neutral-400' : 'border-orange-600'} overflow-hidden shadow-2xl bg-black`}>
                <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${stats.name}&backgroundColor=000000&textColor=ffffff`} 
                    alt={stats.name} 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className={`absolute -top-3 -right-3 ${rank === 1 ? 'bg-yellow-500 text-black' : 'bg-white text-black'} font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md`}>
                {rank}
            </div>
        </div>
        
        <h3 className="mt-2 text-xl font-bold text-white text-center drop-shadow-md">{stats.name}</h3>
        <div className="flex flex-col items-center bg-black/60 rounded-lg px-4 py-2 mt-2 border border-neutral-800 backdrop-blur-sm">
            <span className="text-2xl font-light tracking-tight text-white">{formattedRevenue}</span>
            <div className="flex gap-3 text-xs text-neutral-400 mt-1 uppercase tracking-wide">
                <span className="flex items-center gap-1"><Trophy size={12} className="text-yellow-600"/> {stats.wonCount} vtas</span>
                <span className="flex items-center gap-1"><TrendingUp size={12} className="text-green-500"/> {stats.winRate}%</span>
            </div>
        </div>
      </div>

      {/* The Block */}
      <div className={`w-full min-w-[140px] rounded-t-lg shadow-lg flex items-end justify-center pb-4 ${heightClass} ${colorClass} border-t ${borderClass} relative backdrop-blur-sm`}>
        <Medal size={rank === 1 ? 64 : 48} className={`opacity-10 ${rank === 1 ? 'text-yellow-500' : 'text-white'}`} />
      </div>
    </div>
  );
};

export const Podium: React.FC<PodiumProps> = ({ top3 }) => {
  const podiumData = [
    top3[0] || { name: '-', totalRevenue: 0, wonCount: 0, lostCount: 0, winRate: 0, avgDaysToClose: 0 },
    top3[1] || { name: '-', totalRevenue: 0, wonCount: 0, lostCount: 0, winRate: 0, avgDaysToClose: 0 },
    top3[2] || { name: '-', totalRevenue: 0, wonCount: 0, lostCount: 0, winRate: 0, avgDaysToClose: 0 },
  ];

  return (
    <div className="flex items-end justify-center h-full pb-6 px-4">
      <PodiumItem stats={podiumData[1]} rank={2} />
      <PodiumItem stats={podiumData[0]} rank={1} />
      <PodiumItem stats={podiumData[2]} rank={3} />
    </div>
  );
};