import React, { useMemo } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface KpiCardProps {
    title: string;
    value: string;
    subValue?: string;
    color?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subValue, color = "text-white" }) => (
    <div className="glass-panel p-4 flex flex-col justify-between h-28">
        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</span>
        <div>
            <span className={`text-2xl font-black ${color}`}>{value}</span>
            {subValue && <div className="text-xs text-gray-500 mt-1">{subValue}</div>}
        </div>
    </div>
);

const COLORS = ['#38bdf8', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'];

export const ExecutiveSummary: React.FC = () => {
    const {
        totalLeads, wonCount, lostCount, openCount,
        totalRevenue, avgTicket, avgDaysToClose,
        winRate, avgEffort, byDate
    } = useAnalytics();

    // Chart Data Preparation: Status Distribution
    const statusData = [
        { name: 'Ganado', value: wonCount, color: '#22c55e' },
        { name: 'Abierto', value: openCount, color: '#38bdf8' },
        { name: 'Perdido', value: lostCount, color: '#ef4444' }
    ].filter(d => d.value > 0);

    // Chart Data Preparation: Evolution (Group by Reg Date)
    const evolutionData = useMemo(() => {
        const grouped: Record<string, { date: string, leads: number, won: number, revenue: number }> = {};

        byDate.forEach(sale => {
            // Group by Day
            // Use registration date for Leads, WonDate for Won/Rev?
            // User requested: Leads (Reg Date), Sales (Won Date). 
            // This is tricky for a single line chart X-axis unless we union the dates.
            // For simplicity V1: Group EVERYTHING by Registration Date to see cohort performance?
            // OR: Group by "Date" and plot events that happened on that date (Regs vs Wins).
            // Let's do the latter: Events by Date.

            // 1. Leads by Reg Date
            if (sale.registrationDate && isValid(sale.registrationDate)) {
                const dateKey = format(sale.registrationDate, 'yyyy-MM-dd');
                if (!grouped[dateKey]) grouped[dateKey] = { date: dateKey, leads: 0, won: 0, revenue: 0 };
                grouped[dateKey].leads += 1;
            }

            // 2. Wins by Won Date
            if (sale.status === 'Ganado' && sale.wonLostDate && isValid(sale.wonLostDate)) {
                const dateKey = format(sale.wonLostDate, 'yyyy-MM-dd');
                if (!grouped[dateKey]) grouped[dateKey] = { date: dateKey, leads: 0, won: 0, revenue: 0 };
                grouped[dateKey].won += 1;
                grouped[dateKey].revenue += (sale.revenue || 0);
            }
        });

        return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
    }, [byDate]);

    // Chart Data: Top Sources
    const sourceData = useMemo(() => {
        const counts: Record<string, number> = {};
        byDate.forEach(s => {
            const src = s.attribution || 'Desconocido';
            counts[src] = (counts[src] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [byDate]);


    return (
        <div className="space-y-6 pb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Resumen Ejecutivo</h2>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Ingresos Totales (Periodo)" value={formatCurrency(totalRevenue)} color="text-sky-400" />
                <KpiCard title="Total Leads" value={totalLeads.toString()} color="text-white" />
                <KpiCard title="Ventas Ganadas" value={wonCount.toString()} subValue={`Win Rate: ${formatPercentage(winRate)}`} color="text-green-400" />
                <KpiCard title="Oportunidades Abiertas" value={openCount.toString()} color="text-blue-300" />
                <KpiCard title="Ticket Medio" value={formatCurrency(avgTicket)} color="text-yellow-400" />
                <KpiCard title="Tiempo Cierre (Medio)" value={`${Math.round(avgDaysToClose)} días`} color="text-gray-300" />
                <KpiCard title="Esfuerzo / Lead" value={avgEffort.toFixed(1)} subValue="Llamadas + WhatsApp" color="text-purple-400" />
                <KpiCard title="Leads Perdidos" value={lostCount.toString()} color="text-red-400" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                <div className="glass-panel p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-400 mb-4 select-none">Evolución de Actividad (Diaria)</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={evolutionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94a3b8"
                                    tickFormatter={(str) => format(parseISO(str), 'dd MMM', { locale: es })}
                                    fontSize={12}
                                />
                                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
                                <YAxis yAxisId="right" orientation="right" stroke="#38bdf8" fontSize={12} tickFormatter={(val) => `${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    labelFormatter={(label) => format(parseISO(label), 'dd MMMM yyyy', { locale: es })}
                                />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="leads" name="Leads Nuevos" stroke="#94a3b8" strokeWidth={2} dot={false} />
                                <Line yAxisId="left" type="monotone" dataKey="won" name="Ventas" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                                <Line yAxisId="right" type="monotone" dataKey="revenue" name="Ingresos (€)" stroke="#38bdf8" strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-400 mb-4 select-none">Distribución de Estados</h3>
                    <div className="flex-1 min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="text-3xl font-black text-white">{totalLeads}</div>
                                <div className="text-xs text-gray-400 uppercase">Total Leads</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
                <div className="glass-panel p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-400 mb-4 select-none">Top Fuentes de Atracción</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={sourceData} margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                                <YAxis dataKey="name" type="category" stroke="#f8fafc" fontSize={12} width={100} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="value" name="Leads" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Placeholder for Revenue by Commercial (Simpler version here) */}
                <div className="glass-panel p-4 flex flex-col items-center justify-center text-gray-500">
                    <p>Más detalles en la pestaña "Rendimiento Comercial"</p>
                </div>
            </div>
        </div>
    );
};
