import React, { useMemo } from 'react';
import { useFilter } from '../context/FilterContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export const QualityAnalysis: React.FC = () => {
    const { filteredSales } = useFilter();

    const lostSales = useMemo(() => filteredSales.filter(s => s.status === 'Perdido'), [filteredSales]);

    // 1. Loss Reasons Main
    const reasonData = useMemo(() => {
        const counts: Record<string, number> = {};
        lostSales.forEach(s => {
            const r = s.lossReason || 'Sin motivo especificado';
            counts[r] = (counts[r] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [lostSales]);

    return (
        <div className="space-y-6 pb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Calidad & Motivos de Pérdida</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                {/* Main Loss Reasons */}
                <div className="glass-panel p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-300 mb-4">Principales Motivos de Pérdida</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reasonData} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                                <YAxis dataKey="name" type="category" stroke="#f8fafc" fontSize={12} width={150} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="value" name="Leads Perdidos" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Insight Card */}
                <div className="glass-panel p-6 flex flex-col justify-center items-center text-center">
                    <h3 className="text-6xl font-black text-red-500 mb-2">{lostSales.length}</h3>
                    <p className="text-gray-400 uppercase tracking-widest font-bold">Total Leads Perdidos</p>

                    <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10 w-full">
                        <h4 className="text-sm font-bold text-gray-300 mb-2">Motivo más frecuente</h4>
                        <div className="text-xl text-white">{reasonData[0]?.name || '-'}</div>
                        <div className="text-sm text-gray-500">{reasonData[0]?.value} ocurrencias</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
