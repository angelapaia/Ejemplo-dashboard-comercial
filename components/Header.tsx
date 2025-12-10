import React from 'react';
import { Period } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HeaderProps {
  period: Period;
  lastUpdated: Date;
}

export const Header: React.FC<HeaderProps> = ({ period, lastUpdated }) => {
  const periodLabel = {
    today: 'HOY',
    week: 'ESTA SEMANA',
    month: 'ESTE MES',
    year: 'ESTE AÑO'
  }[period];

  return (
    <header className="flex justify-between items-center p-6 glass-panel mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-wider text-white">
          RANKING COMERCIALES <span className="text-gray-500 mx-2">|</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
            {periodLabel}
          </span>
        </h1>
        <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Actualizado en tiempo real · Objetivo: cerrar más y mejor 🚀
        </p>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-500 uppercase tracking-widest">Última actualización</div>
        <div className="text-xl font-mono text-gray-300">
          {format(lastUpdated, 'HH:mm:ss', { locale: es })}
        </div>
      </div>
    </header>
  );
};