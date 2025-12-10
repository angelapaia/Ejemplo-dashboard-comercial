import React, { useMemo } from 'react';
import { useFilter } from '../context/FilterContext';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis
} from 'recharts';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export const CommercialPerformance: React.FC = () => {
    const { filteredSales } = useFilter();

    // Aggregation Logic
    const metrics = useMemo(() => {
        const map = new Map<string, any>();

        filteredSales.forEach(s => {
            const name = s.commercial || 'Desconocido';
            if (!map.has(name)) {
                map.set(name, {
                    name,
                    leads: 0,
                    won: 0,
                    lost: 0,
                    revenue: 0,
                    calls: 0,
                    whats: 0,
                    daysSum: 0,
                    wonWithDays: 0
                });
            }
            const record = map.get(name);
            record.leads++;
            record.calls += (s.callsOutgoing || 0);
            record.whats += (s.whatsappAnswered || 0);

            if (s.status === 'Ganado') {
                record.won++;
                record.revenue += (s.revenue || 0);
                if (s.daysToClose) {
                    record.daysSum += s.daysToClose;
                    record.wonWithDays++;
                }
            } else if (s.status === 'Perdido') {
                record.lost++;
            }
        });

        // Calculate derived
        return Array.from(map.values()).map(r => ({
            ...r,
            winRate: r.won + r.lost > 0 ? (r.won / (r.won + r.lost)) * 100 : 0,
            avgTicket: r.won > 0 ? r.revenue / r.won : 0,
            avgDays: r.wonWithDays > 0 ? r.daysSum / r.wonWithDays : 0,
            effortPerLead: r.leads > 0 ? (r.calls + r.whats) / r.leads : 0,
            revenuePerLead: r.leads > 0 ? r.revenue / r.leads : 0
        })).sort((a, b) => b.revenue - a.revenue);
    }, [filteredSales]);

    return (
        <div className="space-y-6 pb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Rendimiento por Comercial</h2>

            {/* Bubble Chart: Effort vs Result */}
            <div className="glass-panel p-6 h-96 flex flex-col">
                <h3 className="text-lg font-bold text-gray-300 mb-2">Esfuerzo vs Resultados</h3>
                <p className="text-xs text-gray-500 mb-4">Eje X: Esfuerzo (Llamadas+WA/Lead) — Eje Y: Ingresos/Lead — Tamaño: WinRate</p>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                                type="number"
                                dataKey="effortPerLead"
                                name="Esfuerzo"
                                stroke="#94a3b8"
                                label={{ value: 'Esfuerzo (Acciones/Lead)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
                            />
                            <YAxis
                                type="number"
                                dataKey="revenuePerLead"
                                name="Ingresos/Lead"
                                stroke="#94a3b8"
                                unit="€"
                            />
                            <ZAxis type="number" dataKey="winRate" range={[50, 400]} name="Win Rate" unit="%" />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                formatter={(value: any, name: string) => [
                                    name === 'Ingresos/Lead' ? formatCurrency(value) : (name === 'Win Rate' ? formatPercentage(value) : value.toFixed(1)),
                                    name
                                ]}
                            />
                            <Scatter name="Comerciales" data={metrics} fill="#38bdf8" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="glass-panel p-6 overflow-x-auto">
                <h3 className="text-lg font-bold text-gray-300 mb-4">Tabla Detallada</h3>
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="text-gray-500 border-b border-gray-700">
                            <th className="pb-3 pl-2">Comercial</th>
                            <th className="pb-3 text-right">Leads</th>
                            <th className="pb-3 text-right">Ganados</th>
                            <th className="pb-3 text-right">Win Rate</th>
                            <th className="pb-3 text-right">Ingresos</th>
                            <th className="pb-3 text-right">Ticket Medio</th>
                            <th className="pb-3 text-right">Días Cierre</th>
                            <th className="pb-3 text-right">Esfuerzo/Lead</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((m) => (
                            <tr key={m.name} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                <td className="py-3 pl-2 font-medium text-white bg-slate-900/50 sticky left-0">{m.name}</td>
                                <td className="py-3 text-right text-gray-300">{m.leads}</td>
                                <td className="py-3 text-right text-green-400 font-bold">{m.won}</td>
                                <td className="py-3 text-right text-blue-300 backdrop-blur-sm">{formatPercentage(m.winRate)}</td>
                                <td className="py-3 text-right text-yellow-400 font-bold">{formatCurrency(m.revenue)}</td>
                                <td className="py-3 text-right text-gray-300">{formatCurrency(m.avgTicket)}</td>
                                <td className="py-3 text-right text-gray-300">{m.avgDays.toFixed(1)}</td>
                                <td className="py-3 text-right text-purple-300">{m.effortPerLead.toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
