import React from 'react';
import { CommercialStats } from '../types';
import { User, DollarSign, CheckCircle, Percent } from 'lucide-react';

interface RankingTableProps {
  data: CommercialStats[];
}

export const RankingTable: React.FC<RankingTableProps> = ({ data }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="h-full bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden flex flex-col">
      <div className="p-4 bg-neutral-900 border-b border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-300 flex items-center gap-2 uppercase tracking-wider">
          <User size={16} className="text-white" />
          Ranking Completo
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral-900 text-neutral-500 uppercase text-[10px] tracking-widest sticky top-0 backdrop-blur-md">
            <tr>
              <th className="p-3 text-center">#</th>
              <th className="p-3">Comercial</th>
              <th className="p-3 text-right">Ingresos</th>
              <th className="p-3 text-center">Vtas</th>
              <th className="p-3 text-center">% Win</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {data.map((item, index) => (
              <tr key={item.name} className={`hover:bg-neutral-800/50 transition-colors ${index < 3 ? 'bg-neutral-800/30' : ''}`}>
                <td className="p-3 text-center font-bold text-neutral-600">
                  {index + 1}
                </td>
                <td className="p-3 font-medium text-white flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 overflow-hidden border border-neutral-700">
                     <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.name}&backgroundColor=000000&textColor=ffffff`} 
                        alt="av" className="w-full h-full" 
                    />
                  </div>
                  {item.name}
                </td>
                <td className="p-3 text-right font-medium text-white text-base">
                  {formatCurrency(item.totalRevenue)}
                </td>
                <td className="p-3 text-center text-neutral-400">
                  {item.wonCount}
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    item.winRate >= 50 ? 'text-green-400' : 'text-neutral-500'
                  }`}>
                    {item.winRate}%
                  </span>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-600">No hay datos en este periodo</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};