import React from 'react';
import { CommercialMetric } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface RankingTableProps {
  metrics: CommercialMetric[];
}

export const RankingTable: React.FC<RankingTableProps> = ({ metrics }) => {
  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-gray-300">RANKING GENERAL</h2>
      <div className="overflow-y-auto flex-1 pr-2">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b border-gray-700">
              <th className="pb-3 pl-2 font-medium">#</th>
              <th className="pb-3 font-medium">Comercial</th>
              <th className="pb-3 text-right font-medium">Ventas</th>
              <th className="pb-3 text-right font-medium">Win Rate</th>
              <th className="pb-3 text-right font-medium">Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => (
              <tr
                key={metric.commercial}
                className="group hover:bg-white/5 transition-colors border-b border-gray-800/50 last:border-0"
              >
                <td className="py-4 pl-2 font-mono text-gray-400">
                  {index < 3 ? (
                    <span className={`font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-orange-400'}`}>
                      {index + 1}
                    </span>
                  ) : (
                    index + 1
                  )}
                </td>
                <td className="py-4 font-medium text-white">{metric.commercial}</td>
                <td className="py-4 text-right text-gray-300">{metric.wonCount}</td>
                <td className="py-4 text-right text-gray-300">{formatPercentage(metric.winRate)}</td>
                <td className="py-4 text-right font-bold text-sky-400">
                  {formatCurrency(metric.totalRevenue)}
                </td>
              </tr>
            ))}

            {metrics.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No hay datos para este periodo
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};