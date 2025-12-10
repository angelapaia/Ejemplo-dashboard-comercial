import React from 'react';
import { CommercialMetric } from '../types';
import { formatCurrency } from '../utils/formatters';
import { DollarSign, ShoppingBag, Target, TrendingUp } from 'lucide-react';

interface KpiCardsProps {
    metrics: CommercialMetric[];
    goal?: number; // Optional goal, default to 50k for demo
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics, goal = 50000 }) => {
    const totalRevenue = metrics.reduce((sum, m) => sum + m.totalRevenue, 0);
    const totalSales = metrics.reduce((sum, m) => sum + m.wonCount, 0);
    const topPerformer = metrics.length > 0 ? metrics[0] : null;
    const progress = Math.min((totalRevenue / goal) * 100, 100);

    return (
        <div className="grid grid-cols-4 gap-4 h-full">
            {/* KPI 1: Total Revenue */}
            <div className="glass-panel p-4 flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Ingresos Equipo</div>
                    <div className="text-2xl font-black text-white text-gradient">
                        {formatCurrency(totalRevenue)}
                    </div>
                </div>
                <div className="p-3 bg-sky-500/10 rounded-full">
                    <DollarSign className="w-6 h-6 text-sky-400" />
                </div>
            </div>

            {/* KPI 2: Total Sales */}
            <div className="glass-panel p-4 flex items-center justify-between">
                <div className="relative z-10">
                    <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Ventas Totales</div>
                    <div className="text-2xl font-black text-white">
                        {totalSales}
                    </div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-full">
                    <ShoppingBag className="w-6 h-6 text-purple-400" />
                </div>
            </div>

            {/* KPI 3: Goal Progress */}
            <div className="glass-panel p-4 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Objetivo Mes</div>
                        <div className="text-white font-bold">{formatCurrency(goal)}</div>
                    </div>
                    <div className="text-right">
                        <span className={`text-xl font-black ${progress >= 100 ? 'text-green-400' : 'text-orange-400'}`}>
                            {progress.toFixed(1)}%
                        </span>
                    </div>
                </div>
                {/* Use Target icon purely as decoration if space permits, or simpler bar */}
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${progress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-orange-400 to-sky-400'}`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* KPI 4: Top Performer */}
            <div className="glass-panel p-4 flex items-center gap-4 bg-gradient-to-br from-yellow-900/10 to-transparent border-yellow-500/20 card-shine">
                <div className="p-3 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                    <Target className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                    <div className="text-yellow-500/80 text-xs uppercase tracking-wider font-semibold mb-0.5">MVP del Periodo</div>
                    <div className="text-white font-bold text-lg truncate">
                        {topPerformer ? topPerformer.commercial : '-'}
                    </div>
                    <div className="text-xs text-yellow-500/60 font-mono">
                        {topPerformer ? formatCurrency(topPerformer.totalRevenue) : ''}
                    </div>
                </div>
            </div>
        </div>
    );
};
