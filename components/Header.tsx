import React, { useState, useEffect } from 'react';
import { Period } from '../types';
import { RefreshCw, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HeaderProps {
  currentPeriod: Period;
  setPeriod: (p: Period) => void;
  lastUpdated: Date;
  customStartDate: string;
  setCustomStartDate: (d: string) => void;
  customEndDate: string;
  setCustomEndDate: (d: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPeriod, 
  setPeriod, 
  lastUpdated,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-neutral-900/90 border-b border-neutral-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
      <div className="flex items-center gap-6">
        {/* Logo Replacement */}
        <img 
            src="https://hairsolution.es/wp-content/uploads/2023/05/logotipo_Hair_solution-1@2x.png" 
            alt="Hair Solution" 
            className="h-12 object-contain filter brightness-0 invert" 
        />
        
        <div className="hidden xl:block h-8 w-px bg-neutral-700"></div>
        
        <p className="hidden xl:block text-neutral-400 text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          TIEMPO REAL
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-neutral-800 p-1 rounded-lg border border-neutral-700">
          {[Period.Today, Period.Yesterday, Period.Last7Days, Period.Last30Days, Period.Custom].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-wider ${
                currentPeriod === p
                  ? 'bg-neutral-100 text-black shadow-lg'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Custom Date Pickers (Only visible if Custom is selected) */}
        {currentPeriod === Period.Custom && (
            <div className="flex items-center gap-2 animate-fade-in-up">
                <input 
                    type="date" 
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="bg-neutral-800 border border-neutral-600 text-white text-xs rounded px-2 py-1 outline-none focus:border-white"
                />
                <span className="text-neutral-500">-</span>
                <input 
                    type="date" 
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="bg-neutral-800 border border-neutral-600 text-white text-xs rounded px-2 py-1 outline-none focus:border-white"
                />
            </div>
        )}

        {/* Time Info */}
        <div className="text-right hidden lg:block">
            <div className="text-2xl font-light text-white tracking-widest">
                {format(time, 'HH:mm', { locale: es })}
            </div>
        </div>
      </div>
    </header>
  );
};