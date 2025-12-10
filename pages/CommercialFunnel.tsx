import React, { useMemo } from 'react';
import { useFilter } from '../context/FilterContext';
import {
    FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { formatPercentage } from '../utils/formatters';

export const CommercialFunnel: React.FC = () => {
    const { filteredSales } = useFilter();

    // STAGE FUNNEL LOGIC
    // 1. Define stage order logic (approximate provided by user or standard)
    // The user listed: "Primer contacto", "Cualificación", "Negociación", "Cierre"
    // Plus stats: "Ganado", "Perdido".
    // A Lead starts at "Primer contacto", moves to "Cualificación", etc.
    // Ideally, if a lead is in "Negociación", it *passed through* "Primer Contacto".
    // BUT the CSV usually only shows *Current* Stage.
    // So we count how many are CURRENTLY in each stage, OR we assume a funnel.
    // "Embudo por etapas: Eje vertical: Etapa (orden lógica) Valor: nº de leads"

    const STAGE_ORDER = ['Primer contacto', 'Cualificación', 'Negociación', 'Cierre'];

    const funnelData = useMemo(() => {
        // Count current stage
        const counts: Record<string, number> = {};
        filteredSales.forEach(s => {
            // If status is "Ganado" or "Perdido", what was the last stage?
            // The CSV has an 'Etapa' column.
            // Usually 'Ganado' implies it passed all stages.
            // Let's just visualize the 'Etapa' distribution for Open/Won/Lost.
            const stage = s.stage || 'Desconocido';
            counts[stage] = (counts[stage] || 0) + 1;
        });

        // Construct Funnel Data
        // Recharts Funnel expects data sorted from top to bottom
        return STAGE_ORDER.map(stage => ({
            name: stage,
            value: counts[stage] || 0,
            fill: '#8884d8'
        })).filter(d => d.value >= 0); // Include 0s? Yes for flow
    }, [filteredSales]);

    // SOURCE FUNNEL LOGIC (Stacked Bar)
    const sourceFunnelData = useMemo(() => {
        const grouped: Record<string, { name: string, Ganado: number, Perdido: number, Abierto: number }> = {};

        filteredSales.forEach(s => {
            const attr = s.attribution || 'Desconocido';
            if (!grouped[attr]) grouped[attr] = { name: attr, Ganado: 0, Perdido: 0, Abierto: 0 };
            if (s.status === 'Ganado') grouped[attr].Ganado++;
            else if (s.status === 'Perdido') grouped[attr].Perdido++;
            else grouped[attr].Abierto++;
        });

        return Object.values(grouped).sort((a, b) => (b.Ganado + b.Abierto + b.Perdido) - (a.Ganado + a.Abierto + a.Perdido));
    }, [filteredSales]);

    return (
        <div className="space-y-6 pb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Embudo Comercial</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Stage Funnel */}
                <div className="glass-panel p-6 h-96 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-300 mb-4">Distribución por Etapa (Actual)</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <FunnelChart>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Funnel
                                    dataKey="value"
                                    data={funnelData}
                                    isAnimationActive
                                >
                                    <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Source Stacked Funnel */}
                <div className="glass-panel p-6 h-96 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-300 mb-4">Conversión por Fuente</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sourceFunnelData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" />
                                <YAxis dataKey="name" type="category" stroke="#f8fafc" width={100} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Legend />
                                <Bar dataKey="Ganado" stackId="a" fill="#22c55e" />
                                <Bar dataKey="Abierto" stackId="a" fill="#38bdf8" />
                                <Bar dataKey="Perdido" stackId="a" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Metrics Table */}
            <div className="glass-panel p-6">
                <h3 className="text-lg font-bold text-gray-300 mb-4">Métricas de Conversión</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-500 border-b border-gray-700">
                            <th className="pb-2">Fuente</th>
                            <th className="pb-2 text-right">Total Leads</th>
                            <th className="pb-2 text-right">Ganados</th>
                            <th className="pb-2 text-right">Tasa Conv.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sourceFunnelData.map((row) => {
                            const total = row.Ganado + row.Perdido + row.Abierto;
                            const rate = total > 0 ? (row.Ganado / total) * 100 : 0;
                            return (
                                <tr key={row.name} className="border-b border-gray-800/50 hover:bg-white/5">
                                    <td className="py-2 text-white">{row.name}</td>
                                    <td className="py-2 text-right text-gray-300">{total}</td>
                                    <td className="py-2 text-right text-green-400 font-bold">{row.Ganado}</td>
                                    <td className="py-2 text-right text-blue-300">{formatPercentage(rate)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
