import React, { useMemo } from 'react';
import { useFilter } from '../context/FilterContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

export const TimeAnalysis: React.FC = () => {
    const { filteredSales } = useFilter();

    // 1. Distribution (Histogram)
    const distributionData = useMemo(() => {
        const bins = {
            '< 1 día': 0,
            '1-3 días': 0,
            '4-7 días': 0,
            '8-14 días': 0,
            '15-30 días': 0,
            '> 30 días': 0
        };

        filteredSales.filter(s => s.status === 'Ganado' && typeof s.daysToClose === 'number').forEach(s => {
            const d = s.daysToClose || 0;
            if (d < 1) bins['< 1 día']++;
            else if (d <= 3) bins['1-3 días']++;
            else if (d <= 7) bins['4-7 días']++;
            else if (d <= 14) bins['8-14 días']++;
            else if (d <= 30) bins['15-30 días']++;
            else bins['> 30 días']++;
        });

        return Object.entries(bins).map(([name, value]) => ({ name, value }));
    }, [filteredSales]);

    // 2. Time vs Revenue (Scatter)
    const scatterData = useMemo(() => {
        return filteredSales
            .filter(s => s.status === 'Ganado' && typeof s.daysToClose === 'number')
            .map(s => ({
                days: s.daysToClose,
                revenue: s.revenue,
                commercial: s.commercial
            }));
    }, [filteredSales]);

    // 3. Avg Time by Commercial
    const avgTimeData = useMemo(() => {
        const grouped: Record<string, { total: number, count: number }> = {};
        filteredSales.filter(s => s.status === 'Ganado').forEach(s => {
            const c = s.commercial || 'N/A';
            if (!grouped[c]) grouped[c] = { total: 0, count: 0 };
            grouped[c].total += (s.daysToClose || 0);
            grouped[c].count++;
        });
        return Object.entries(grouped)
            .map(([name, val]) => ({ name, avg: val.count > 0 ? val.total / val.count : 0 }))
            .sort((a, b) => a.avg - b.avg); // Ascending (Faster is better)
    }, [filteredSales]);

    return (
        <div className="space-y-6 pb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Tiempo & Velocidad de Cierre</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                {/* Distribution */}
                <div className="glass-panel p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-300 mb-4">Distribución de Tiempo de Cierre</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distributionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="value" name="Ventas" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Avg Process Time */}
                <div className="glass-panel p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-300 mb-4">Velocidad Media por Comercial</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={avgTimeData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" fontSize={12} unit=" días" />
                                <YAxis dataKey="name" type="category" stroke="#f8fafc" fontSize={12} width={100} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} formatter={(val: number) => val.toFixed(1) + ' dias'} />
                                <Bar dataKey="avg" name="Días Media" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Scatter Time vs Money */}
            <div className="glass-panel p-6 h-80 flex flex-col">
                <h3 className="text-lg font-bold text-gray-300 mb-2">Relación: Tiempo de Cierre vs Ingresos</h3>
                <p className="text-xs text-gray-500 mb-4">¿Las ventas más grandes tardan más en cerrarse?</p>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis type="number" dataKey="days" name="Días" stroke="#94a3b8" unit="d" />
                            <YAxis type="number" dataKey="revenue" name="Ingresos" stroke="#94a3b8" unit="€" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                            <Scatter name="Ventas" data={scatterData} fill="#ec4899" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
