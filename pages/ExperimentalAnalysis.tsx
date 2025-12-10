import React, { useMemo } from 'react';
import { useFilter } from '../context/FilterContext';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

export const ExperimentalAnalysis: React.FC = () => {
    const { filteredSales } = useFilter();

    // 1. Commercial Scoring (Effort vs Revenue Efficiency)
    // Score = (Call * 1) + (WA * 0.5) - (Failed * 0.2)
    const scoringData = useMemo(() => {
        const grouped: Record<string, any> = {};

        filteredSales.forEach(s => {
            const name = s.commercial || 'N/A';
            if (!grouped[name]) grouped[name] = { name, effortScore: 0, revenue: 0, leads: 0 };

            const score = (s.callsOutgoing || 0) * 1.0 + (s.whatsappAnswered || 0) * 0.5 - (s.callsIncomingFailed || 0) * 0.2;

            grouped[name].effortScore += score;
            grouped[name].leads++;
            if (s.status === 'Ganado') {
                grouped[name].revenue += (s.revenue || 0);
            }
        });

        return Object.values(grouped).map(r => ({
            ...r,
            avgEffortScore: r.leads > 0 ? r.effortScore / r.leads : 0,
            revenuePerEffort: r.effortScore > 0 ? r.revenue / r.effortScore : 0
        }));
    }, [filteredSales]);

    // 2. Priority List (Open Leads)
    // Sort by: Calls Realded (desc)
    const priorityLeads = useMemo(() => {
        return filteredSales
            .filter(s => s.status === 'Abierto')
            .map(s => ({
                ...s,
                totalActivity: (s.callsOutgoing || 0) + (s.whatsappAnswered || 0)
            }))
            .sort((a, b) => b.totalActivity - a.totalActivity)
            .slice(0, 10);
    }, [filteredSales]);

    return (
        <div className="space-y-6 pb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Experimental & Scoring</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                {/* Efficiency Scatter */}
                <div className="glass-panel p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-300 mb-2">Eficiencia del Esfuerzo Comercial</h3>
                    <p className="text-xs text-gray-500 mb-4">Eje X: Score Esfuerzo — Eje Y: Retorno (€) por unidad de esfuerzo</p>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" dataKey="avgEffortScore" name="Score Esfuerzo Medio" stroke="#94a3b8" />
                                <YAxis type="number" dataKey="revenuePerEffort" name="€ / Esfuerzo" stroke="#94a3b8" />
                                <ZAxis type="category" dataKey="name" name="Comercial" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Scatter name="Comerciales" data={scoringData} fill="#f472b6" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Priority Table */}
                <div className="glass-panel p-6 overflow-x-auto">
                    <h3 className="text-lg font-bold text-gray-300 mb-2">Top 10 Oportunidades "Calientes" (Abiertas)</h3>
                    <p className="text-xs text-gray-500 mb-4">Leads abiertos con mayor inversión de actividad.</p>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="text-gray-500 border-b border-gray-700">
                                <th className="pb-2">Cliente</th>
                                <th className="pb-2">Comercial</th>
                                <th className="pb-2 text-center">Actividad Realizada</th>
                                <th className="pb-2 text-right">Solución</th>
                            </tr>
                        </thead>
                        <tbody>
                            {priorityLeads.map((s) => (
                                <tr key={s.id} className="border-b border-gray-800/50 hover:bg-white/5">
                                    <td className="py-2 text-white">{s.clientName}</td>
                                    <td className="py-2 text-gray-400">{s.commercial}</td>
                                    <td className="py-2 text-center">
                                        <span className="bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-bold">
                                            {s.totalActivity}
                                        </span>
                                    </td>
                                    <td className="py-2 text-right text-sky-300">{s.solution}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
