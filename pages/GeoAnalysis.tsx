import React, { useMemo } from 'react';
import { useFilter } from '../context/FilterContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export const GeoAnalysis: React.FC = () => {
    const { filteredSales } = useFilter();

    const data = useMemo(() => {
        const grouped: Record<string, any> = {};

        filteredSales.forEach(s => {
            const loc = s.location || 'Desconocido';
            if (!grouped[loc]) grouped[loc] = { name: loc, leads: 0, won: 0, revenue: 0 };

            grouped[loc].leads++;
            if (s.status === 'Ganado') {
                grouped[loc].won++;
                grouped[loc].revenue += (s.revenue || 0);
            }
        });

        return Object.values(grouped).map(r => ({
            ...r,
            winRate: r.leads > 0 ? (r.won / r.leads) * 100 : 0,
            avgTicket: r.won > 0 ? r.revenue / r.won : 0
        })).sort((a, b) => b.revenue - a.revenue);
    }, [filteredSales]);

    return (
        <div className="space-y-6 pb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Análisis Geográfico</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                {/* Revenue by City */}
                <div className="glass-panel p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-300 mb-4">Ingresos por Ubicación</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="revenue" name="Ingresos" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Win Rate by City */}
                <div className="glass-panel p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-300 mb-4">Win Rate por Ubicación</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" unit="%" stroke="#94a3b8" fontSize={12} />
                                <YAxis dataKey="name" type="category" stroke="#f8fafc" fontSize={12} width={100} />
                                <Tooltip formatter={(val: number) => formatPercentage(val)} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="winRate" name="Win Rate" fill="#22c55e" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
