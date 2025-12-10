import React from 'react';
import { useSalesData } from '../hooks/useSalesData';
import { Header } from './Header';
import { Podium } from './Podium';
import { RankingTable } from './RankingTable';
import { KpiCards } from './KpiCards';
import { NewsTicker } from './NewsTicker';
import { Period } from '../types';
import { Loader2 } from 'lucide-react';

export const ArenaView: React.FC = () => {
    const { period, setPeriod, metrics, sales, lastUpdated, loading } = useSalesData();

    return (
        <div className="min-h-screen bg-transparent text-white p-6 pb-16 flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
            </div>

            <Header period={period} lastUpdated={lastUpdated} />

            {/* Period Selector (Hidden controls for TV, but accessible) */}
            <div className="absolute top-8 right-8 z-50 opacity-0 hover:opacity-100 transition-opacity">
                <div className="glass-panel p-2 flex gap-2">
                    {(['today', 'week', 'month', 'year'] as Period[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1 rounded text-xs uppercase font-bold ${period === p ? 'bg-sky-500 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            {p === 'today' ? 'Hoy' : p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : 'Año'}
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Left Zone: Podium (7 cols) */}
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                    <div className="flex-1 min-h-0">
                        <Podium metrics={metrics} />
                    </div>
                </div>

                {/* Right Zone: Ranking (5 cols) */}
                <div className="col-span-12 lg:col-span-5 min-h-0">
                    <RankingTable metrics={metrics} />
                </div>

                {/* Bottom Zone: KPIs (Span full width) */}
                <div className="col-span-12 h-32">
                    <KpiCards metrics={metrics} />
                </div>
            </main>

            <NewsTicker sales={sales} />

            {loading && metrics.length === 0 && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[100]">
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
                        <div className="text-xl font-light tracking-widest text-white">CARGANDO DATOS...</div>
                    </div>
                </div>
            )}
        </div>
    );
};
