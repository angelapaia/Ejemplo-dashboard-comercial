import React from 'react';
import { CommercialMetric } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { Trophy, Medal } from 'lucide-react';

interface PodiumProps {
  metrics: CommercialMetric[];
}

export const Podium: React.FC<PodiumProps> = ({ metrics }) => {
  const top3 = metrics.slice(0, 3);

  // Need exactly 3 for the layout, fill with empty if needed
  while (top3.length < 3) {
    top3.push({ commercial: 'N/A', totalRevenue: 0, wonCount: 0, lostCount: 0, winRate: 0, avgDaysToClose: 0, openDeals: [], deals: [] });
  }

  // Reorder for visual podium: 2nd, 1st, 3rd (Left, Center, Right)
  const [first, second, third] = top3;
  const orderedPodium = [second, first, third];

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-8 text-gray-300 flex items-center gap-2">
        <Trophy className="text-yellow-500" /> PODIO LÍDERES
      </h2>

      <div className="flex-1 flex items-end justify-center gap-4 pb-4">
        {orderedPodium.map((metric, index) => {
          // Determine rank based on position in ordered array [2nd, 1st, 3rd]
          // index 0 = 2nd Place (Silver)
          // index 1 = 1st Place (Gold)
          // index 2 = 3rd Place (Bronze)

          let rank = 0;
          let height = 'h-64';
          let color = '';
          let glow = '';
          let icon = null;
          let scale = '';

          if (index === 1) { // 1st
            rank = 1;
            height = 'h-80';
            color = 'bg-gradient-to-t from-yellow-600/50 to-yellow-400/20 border-yellow-500/50';
            glow = 'shadow-[0_0_50px_-12px_rgba(234,179,8,0.5)]';
            icon = <Trophy className="w-12 h-12 text-yellow-400 mb-2 drop-shadow-lg" />;
            scale = 'z-10 transform -translate-y-4';
          } else if (index === 0) { // 2nd
            rank = 2;
            height = 'h-64';
            color = 'bg-gradient-to-t from-gray-500/50 to-gray-300/20 border-gray-400/50';
            glow = 'shadow-[0_0_30px_-12px_rgba(156,163,175,0.5)]';
            icon = <Medal className="w-8 h-8 text-gray-300 mb-2" />;
          } else { // 3rd
            rank = 3;
            height = 'h-56';
            color = 'bg-gradient-to-t from-orange-800/50 to-orange-600/20 border-orange-700/50';
            glow = 'shadow-[0_0_30px_-12px_rgba(194,65,12,0.5)]';
            icon = <Medal className="w-8 h-8 text-orange-400 mb-2" />;
          }

          if (metric.commercial === 'N/A') return <div key={index} className="w-1/3"></div>;

          return (
            <div key={metric.commercial} className={`relative w-1/3 flex flex-col justify-end ${scale}`}>
              {/* Avatar Placeholder / Info Card */}
              <div className="mb-3 text-center animate-fade-in">
                {icon}
                <div className="font-bold text-lg text-white truncate px-2">{metric.commercial}</div>
                <div className="text-2xl font-black text-white drop-shadow-md">
                  {formatCurrency(metric.totalRevenue)}
                </div>
                <div className="text-xs text-gray-400 mt-1 space-y-1">
                  <div className="bg-white/10 rounded px-2 py-0.5 inline-block">
                    {metric.wonCount} ventas
                  </div>
                </div>
              </div>

              {/* Bar */}
              <div className={`w-full ${height} rounded-t-xl border-t border-x ${color} ${glow} relative overflow-hidden group transition-all duration-500`}>
                <div className="absolute bottom-0 w-full text-center py-4 bg-black/20 backdrop-blur-sm">
                  <div className="text-3xl font-bold opacity-30">{rank}º</div>
                  <div className="text-sm font-semibold text-white/80">Win Rate: {formatPercentage(metric.winRate)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};