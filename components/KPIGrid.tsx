import React from 'react';
import { Target, TrendingUp, Trophy, Award, Zap } from 'lucide-react';

interface KPIGridProps {
  totalRevenue: number;
  totalSales: number;
  goal: number;
  topCommercialName: string;
  topCommercialRevenue: number;
  fastestCommercialName?: string;
}

export const KPIGrid: React.FC<KPIGridProps> = ({
  totalRevenue,
  totalSales,
  goal,
  topCommercialName,
  topCommercialRevenue,
  fastestCommercialName
}) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const progress = Math.min((totalRevenue / (goal || 1)) * 100, 100);

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {/* Revenue */}
      <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <TrendingUp size={64} />
        </div>
        <h4 className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Ingresos Equipo</h4>
        <div className="text-3xl font-light text-white mt-1">{formatCurrency(totalRevenue)}</div>
      </div>

      {/* Goal Progress */}
      <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 flex flex-col justify-between relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-5">
          <Target size={64} />
        </div>
        <h4 className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Objetivo ({formatCurrency(goal)})</h4>
        <div className="mt-2">
            <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-light text-white">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-2">
                <div 
                    className="bg-white h-2 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                >
                    {progress >= 100 && (
                        <span className="absolute -right-1 -top-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></span>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Total Sales count */}
      <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Award size={64} />
        </div>
        <h4 className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Ventas Totales</h4>
        <div className="text-3xl font-light text-white mt-1">{totalSales}</div>
      </div>

      {/* Top Performer of Period */}
      <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700 flex flex-col justify-between relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10 text-yellow-500">
          <Trophy size={64} />
        </div>
        <h4 className="text-yellow-500/80 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
            <Zap size={12} className="fill-current" /> MVP
        </h4>
        <div className="mt-1">
            <div className="text-xl font-medium text-white truncate">{topCommercialName || '-'}</div>
            <div className="text-lg font-light text-neutral-400">{topCommercialRevenue > 0 ? formatCurrency(topCommercialRevenue) : ''}</div>
        </div>
      </div>
    </div>
  );
};