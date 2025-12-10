import React from 'react';
import { useFilter } from '../context/FilterContext';

export const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
    const { filteredSales } = useFilter();

    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <h1 className="text-3xl font-bold text-gray-300 mb-2">{title}</h1>
            <p className="mb-4">Esta vista está en construcción.</p>
            <div className="p-4 bg-white/5 rounded border border-white/10">
                <p className="font-mono text-sm">
                    Contexto activo: <span className="text-sky-400">{filteredSales.length}</span> registros filtrados.
                </p>
            </div>
        </div>
    );
};
