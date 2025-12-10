import React from 'react';
import { SaleRecord } from '../types';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SalesTickerProps {
  recentSales: SaleRecord[];
}

export const SalesTicker: React.FC<SalesTickerProps> = ({ recentSales }) => {
  if (recentSales.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full h-12 bg-black border-t border-neutral-800 flex items-center overflow-hidden z-50">
      <div className="bg-neutral-900 h-full px-4 flex items-center justify-center text-white font-bold text-xs tracking-[0.2em] uppercase z-10 border-r border-neutral-800 min-w-[140px]">
        Últimas Ventas
      </div>
      
      <div className="flex whitespace-nowrap overflow-hidden w-full relative">
        <div className="animate-marquee flex items-center gap-16 pl-4">
          {recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center gap-3 text-white">
              <span className="text-green-500 animate-pulse">
                <Bell size={14} fill="currentColor" />
              </span>
              <span className="font-bold text-neutral-200 uppercase text-sm tracking-wide">{sale.comercial}</span>
              <span className="text-neutral-600">|</span>
              <span className="font-light text-neutral-300">{sale.solution}</span>
              <span className="text-neutral-600">|</span>
              <span className="font-bold text-green-400">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(sale.revenue)}
              </span>
              <span className="text-neutral-600">|</span>
              <span className="text-neutral-400 text-xs uppercase">{sale.location}</span>
              <span className="text-neutral-600">|</span>
              <span className="text-xs text-neutral-500">
                {format(sale.date, "d MMM HH:mm", { locale: es })}
              </span>
            </div>
          ))}
           {/* Duplicate for loop */}
           {recentSales.map((sale) => (
            <div key={`${sale.id}-dup`} className="flex items-center gap-3 text-white">
               <span className="text-green-500 animate-pulse">
                <Bell size={14} fill="currentColor" />
              </span>
              <span className="font-bold text-neutral-200 uppercase text-sm tracking-wide">{sale.comercial}</span>
              <span className="text-neutral-600">|</span>
              <span className="font-light text-neutral-300">{sale.solution}</span>
              <span className="text-neutral-600">|</span>
              <span className="font-bold text-green-400">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(sale.revenue)}
              </span>
              <span className="text-neutral-600">|</span>
              <span className="text-neutral-400 text-xs uppercase">{sale.location}</span>
              <span className="text-neutral-600">|</span>
              <span className="text-xs text-neutral-500">
                {format(sale.date, "d MMM HH:mm", { locale: es })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};