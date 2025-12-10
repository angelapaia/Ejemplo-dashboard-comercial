import React from 'react';
import { useFilter, FilterState } from '../context/FilterContext';
import { Filter, X, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const FilterBar: React.FC = () => {
    const { filters, setFilters, uniqueValues, filteredSales, allSales } = useFilter();

    const handleMultiSelect = (key: keyof FilterState, value: string) => {
        setFilters(prev => {
            const current = prev[key] as string[];
            if (current.includes(value)) {
                return { ...prev, [key]: current.filter(v => v !== value) };
            } else {
                return { ...prev, [key]: [...current, value] };
            }
        });
    };

    const clearFilters = () => {
        setFilters(prev => ({
            ...prev,
            commercials: [],
            attribution: [],
            locations: [],
            status: [],
            stage: [],
            solutions: []
        }));
    };

    const activeCount =
        filters.commercials.length +
        filters.attribution.length +
        filters.locations.length +
        filters.status.length +
        filters.stage.length +
        filters.solutions.length;

    return (
        <div className="glass-panel p-4 mb-6 sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400 mr-4">
                    <Filter className="w-5 h-5 text-sky-400" />
                    <span className="text-sm font-bold uppercase tracking-wider">Filtros</span>
                    {activeCount > 0 && (
                        <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                            <X className="w-3 h-3" /> Limpiar ({activeCount})
                        </button>
                    )}
                </div>

                {/* Date Range (Simplified as inputs for now) */}
                <div className="flex items-center gap-2 bg-white/5 rounded px-2 py-1 border border-white/10">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <input
                        type="date"
                        value={format(filters.dateRange.start, 'yyyy-MM-dd')}
                        onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.valueAsDate || new Date() } }))}
                        className="bg-transparent text-white text-sm outline-none w-32"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                        type="date"
                        value={format(filters.dateRange.end, 'yyyy-MM-dd')}
                        onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.valueAsDate || new Date() } }))}
                        className="bg-transparent text-white text-sm outline-none w-32"
                    />
                </div>

                {/* Dynamic Selects */}
                <Dropdown label="Comercial" options={uniqueValues.commercials} selected={filters.commercials} onToggle={(v) => handleMultiSelect('commercials', v)} />
                <Dropdown label="Estado" options={uniqueValues.status} selected={filters.status} onToggle={(v) => handleMultiSelect('status', v)} />
                <Dropdown label="Fuente" options={uniqueValues.attribution} selected={filters.attribution} onToggle={(v) => handleMultiSelect('attribution', v)} />
                <Dropdown label="Solución" options={uniqueValues.solutions} selected={filters.solutions} onToggle={(v) => handleMultiSelect('solutions', v)} />
                <Dropdown label="Etapa" options={uniqueValues.stage} selected={filters.stage} onToggle={(v) => handleMultiSelect('stage', v)} />
                <Dropdown label="Ubicación" options={uniqueValues.locations} selected={filters.locations} onToggle={(v) => handleMultiSelect('locations', v)} />

                <div className="ml-auto text-sm text-gray-400">
                    Mostrando <span className="text-white font-bold">{filteredSales.length}</span> de {allSales.length} registros
                </div>
            </div>
        </div>
    );
};

const Dropdown: React.FC<{ label: string, options: string[], selected: string[], onToggle: (val: string) => void }> = ({ label, options, selected, onToggle }) => {
    return (
        <div className="relative group">
            <button className={`px-3 py-1.5 rounded text-sm border flex items-center gap-2 transition-all ${selected.length > 0 ? 'bg-sky-500/20 border-sky-500 text-sky-300' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}>
                {label} {selected.length > 0 && <span className="bg-sky-500 text-white text-[10px] px-1.5 rounded-full">{selected.length}</span>}
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 max-h-60 overflow-y-auto glass-panel p-2 hidden group-hover:block z-50">
                {options.map(opt => (
                    <label key={opt} className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded cursor-pointer text-sm text-gray-300">
                        <input
                            type="checkbox"
                            checked={selected.includes(opt)}
                            onChange={() => onToggle(opt)}
                            className="accent-sky-500 rounded"
                        />
                        {opt}
                    </label>
                ))}
            </div>
        </div>
    )
}
