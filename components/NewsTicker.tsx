import React from 'react';
import { Sale } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Bell } from 'lucide-react';

interface NewsTickerProps {
    sales: Sale[];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ sales }) => {
    // Filter for ONLY new won sales, or just the last N won sales.
    // The user says "Ultimas N ventas... orden descendente". 
    // For the ticker we need them in a flat list.

    const recentSales = sales
        .filter(s => s.status === 'Ganado')
        .sort((a, b) => {
            const dateA = a.wonLostDate ? a.wonLostDate.getTime() : 0;
            const dateB = b.wonLostDate ? b.wonLostDate.getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, 10); // Take top 10

    if (recentSales.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full h-12 bg-black/40 backdrop-blur-md border-t border-white/10 flex items-center z-50 overflow-hidden">
            <div className="flex bg-sky-600 h-full px-4 items-center z-20 shadow-xl">
                <span className="font-bold text-white text-sm uppercase tracking-wider whitespace-nowrap flex gap-2">
                    <Bell className="w-4 h-4" /> Últimas Ventas
                </span>
            </div>

            <div className="flex-1 overflow-hidden relative h-full flex items-center">
                {/* Ticker Container with Animation */}
                <div className="whitespace-nowrap flex animate-[ticker_30s_linear_infinite] px-4 gap-12">
                    {recentSales.map((sale) => (
                        <div key={sale.id} className="flex items-center gap-2 text-sm text-gray-200">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="font-bold text-white">{sale.commercial}</span>
                            <span className="text-gray-400">vendió</span>
                            <span className="text-sky-300 font-medium">{sale.solution}</span>
                            <span className="text-yellow-400 font-bold">({formatCurrency(sale.revenue)})</span>
                            <span className="text-gray-500 text-xs ml-1">📍 {sale.location} · {sale.wonLostDate ? formatDate(sale.wonLostDate) : ''}</span>
                        </div>
                    ))}
                    {/* Duplicated for seamless loop if needed, though simple CSS animation usually wraps if contents match width. 
                 For a true infinite marquee, we usually double the content. */}
                    {recentSales.map((sale) => (
                        <div key={`dup-${sale.id}`} className="flex items-center gap-2 text-sm text-gray-200">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="font-bold text-white">{sale.commercial}</span>
                            <span className="text-gray-400">vendió</span>
                            <span className="text-sky-300 font-medium">{sale.solution}</span>
                            <span className="text-yellow-400 font-bold">({formatCurrency(sale.revenue)})</span>
                            <span className="text-gray-500 text-xs ml-1">📍 {sale.location} · {sale.wonLostDate ? formatDate(sale.wonLostDate) : ''}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
