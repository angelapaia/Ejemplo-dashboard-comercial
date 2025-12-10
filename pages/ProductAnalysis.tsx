import React, { useMemo } from 'react';
import { useFilter } from '../context/FilterContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

export const ProductAnalysis: React.FC = () => {
    const { filteredSales } = useFilter();

    const data = useMemo(() => {
        const grouped: Record<string, any> = {};

        filteredSales.forEach(s => {
            const sol = s.solution || 'Otros';
            if (!grouped[sol]) grouped[sol] = { name: sol, leads: 0, won: 0, revenue: 0 };

            grouped[sol].leads++;
            if (s.status === 'Ganado') {
                grouped[sol].won++;
                grouped[sol].revenue += (s.revenue || 0);
            }
        });

        const arr = Object.values(grouped)
            .map(r => ({
                ...r,
                winRate: r.leads > 0 ? (r.won / r.leads) * 100 : 0,
                avgTicket: r.won > 0 ? r.revenue / r.won : 0
            }))
            .sort((a, b) => b.revenue - a.revenue);

        return arr;
    }, [filteredSales]);

    return (
        <div className="space-y-6 pb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Análisis de Soluciones</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                {/* Product Mix (Revenue) */}
                <div className="glass-panel p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-300 mb-4">Mix de Ingresos (Producto)</h3>
                    <div className="flex-1 min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="revenue"
                                    nameKey="name"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                />
                                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Win Rate by Product */}
                <div className="glass-panel p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-300 mb-4">Win Rate por Solución</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" unit="%" stroke="#94a3b8" />
                                <YAxis dataKey="name" type="category" stroke="#f8fafc" width={120} fontSize={12} />
                                <Tooltip
                                    formatter={(val: number, name: string) => name === 'winRate' ? formatPercentage(val) : val}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                />
                                <Bar dataKey="winRate" name="Win Rate" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Metrics Table */}
            <div className="glass-panel p-6">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-gray-500 border-b border-gray-700">
                            <th className="pb-3">Solución</th>
                            <th className="pb-3 text-right">Leads</th>
                            <th className="pb-3 text-right">Ventas</th>
                            <th className="pb-3 text-right">Ingresos Totales</th>
                            <th className="pb-3 text-right">Ticket Medio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.name} className="border-b border-gray-800/50 hover:bg-white/5">
                                <td className="py-3 text-white font-medium">{row.name}</td>
                                <td className="py-3 text-right text-gray-300">{row.leads}</td>
                                <td className="py-3 text-right text-gray-300">{row.won}</td>
                                <td className="py-3 text-right text-sky-400 font-bold">{formatCurrency(row.revenue)}</td>
                                <td className="py-3 text-right text-yellow-400">{formatCurrency(row.avgTicket)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
