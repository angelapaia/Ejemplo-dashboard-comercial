import React, { useMemo } from 'react';
import { useFilter } from '../context/FilterContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export const MarketingAnalysis: React.FC = () => {
    const { filteredSales, uniqueValues } = useFilter();

    // Aggregations
    const data = useMemo(() => {
        const grouped: Record<string, any> = {};

        filteredSales.forEach(s => {
            const src = s.attribution || 'Desconocido';
            if (!grouped[src]) grouped[src] = { name: src, leads: 0, won: 0, lost: 0, revenue: 0, totalDays: 0, wonCountDays: 0 };

            const r = grouped[src];
            r.leads++;
            if (s.status === 'Ganado') {
                r.won++;
                r.revenue += (s.revenue || 0);
                if (s.daysToClose) {
                    r.totalDays += s.daysToClose;
                    r.wonCountDays++;
                }
            } else if (s.status === 'Perdido') {
                r.lost++;
            }
        });

        return Object.values(grouped).map(r => ({
            ...r,
            winRate: r.leads > 0 ? (r.won / r.leads) * 100 : 0,
            avgTicket: r.won > 0 ? r.revenue / r.won : 0,
            avgDays: r.wonCountDays > 0 ? r.totalDays / r.wonCountDays : 0,
            cpl: 0 // Placeholder for cost per lead if data existed
        })).sort((a, b) => b.leads - a.leads);
    }, [filteredSales]);

    // Heatmap Data (Source x Commercial)
    const heatmapData = useMemo(() => {
        const matrix: Record<string, Record<string, number>> = {};
        filteredSales.forEach(s => {
            const src = s.attribution || 'Unknown';
            const comm = s.commercial || 'Unknown';

            if (!matrix[src]) matrix[src] = {};
            // Metric: Win Rate or Revenue? Let's do Win Count for intensity
            matrix[src][comm] = (matrix[src][comm] || 0) + (s.status === 'Ganado' ? 1 : 0);
        });
        return matrix;
    }, [filteredSales]);

    const commercials = uniqueValues.commercials;

    return (
        <div className="space-y-6 pb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Marketing & Atribución</h2>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                <div className="glass-panel p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-300 mb-4">Ingresos por Fuente</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="revenue" name="Ingresos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-300 mb-4">Win Rate por Fuente</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" unit="%" stroke="#94a3b8" fontSize={12} />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="winRate" name="Win Rate %" fill="#38bdf8" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Heatmap Section */}
            <div className="glass-panel p-6 overflow-x-auto">
                <h3 className="text-lg font-bold text-gray-300 mb-4">Mapa de Calor: Ventas Ganadas (Fuente vs Comercial)</h3>
                <div className="min-w-max">
                    <div className="flex">
                        <div className="w-32 flex-shrink-0"></div> {/* Corner */}
                        {commercials.map(c => (
                            <div key={c} className="w-24 p-2 text-center text-xs font-bold text-gray-400 rotate-0">{c}</div>
                        ))}
                    </div>
                    {Object.entries(heatmapData).map(([source, comms]) => (
                        <div key={source} className="flex border-b border-gray-800/50 hover:bg-white/5">
                            <div className="w-32 p-2 text-sm font-medium text-white flex-shrink-0 truncate" title={source}>{source}</div>
                            {commercials.map(comm => {
                                const val = comms[comm] || 0;
                                let bg = '';
                                if (val === 0) bg = 'opacity-20';
                                else if (val < 2) bg = 'bg-green-900/40 text-green-200';
                                else if (val < 5) bg = 'bg-green-700/60 text-white font-bold';
                                else bg = 'bg-green-500 text-white font-black shadow-lg shadow-green-500/20';

                                return (
                                    <div key={comm} className={`w-24 p-2 flex items-center justify-center transition-all`}>
                                        <div className={`h-8 w-12 rounded flex items-center justify-center ${bg}`}>
                                            {val > 0 ? val : '-'}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
