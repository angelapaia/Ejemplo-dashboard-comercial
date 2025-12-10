import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Sale, SaleStatus } from '../types';
import { useSalesData } from '../hooks/useSalesData';
import { isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';

export interface FilterState {
    dateRange: { start: Date; end: Date }; // Default: This Month
    commercials: string[];
    attribution: string[];
    locations: string[];
    status: SaleStatus[];
    stage: string[];
    solutions: string[];
}

interface FilterContextType {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    filteredSales: Sale[];
    allSales: Sale[];
    loading: boolean;
    uniqueValues: {
        commercials: string[];
        attribution: string[];
        locations: string[];
        status: string[];
        stage: string[];
        solutions: string[];
    };
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
};

// Standard date range: Current Month
const getDefaultDateRange = () => {
    const now = new Date();
    return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: endOfDay(now)
    };
};

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { allSales, loading } = useSalesData(); // Base data from polling

    const [filters, setFilters] = useState<FilterState>({
        dateRange: getDefaultDateRange(),
        commercials: [], // Empty = All
        attribution: [],
        locations: [],
        status: [], // Empty = All 
        stage: [],
        solutions: []
    });

    // Unique values for dropdowns
    const uniqueValues = useMemo(() => {
        const getUnique = (key: keyof Sale) => Array.from(new Set(allSales.map(s => String(s[key] || '')))).filter(Boolean).sort();
        return {
            commercials: getUnique('commercial'),
            attribution: getUnique('attribution'),
            locations: getUnique('location'),
            status: getUnique('status'),
            stage: getUnique('stage'),
            solutions: getUnique('solution')
        };
    }, [allSales]);

    // Apply filters
    const filteredSales = useMemo(() => {
        return allSales.filter(sale => {
            // Date Range (using Registration Date by default as per 'Leads' focus, or Won Date?)
            // User said: "Rango de fechas (por Fecha Registro y opcionalmente por Fecha ganado/perdido)"
            // Let's use Registration Date as primary for "Leads" analysis, but if analyzing "Sales" maybe WonDate?
            // Let's stick to Registration Date for the general funnel.

            const dateToCheck = sale.registrationDate;
            if (!dateToCheck) return false;

            // Simple check
            if (dateToCheck < filters.dateRange.start || dateToCheck > filters.dateRange.end) {
                return false;
            }

            if (filters.commercials.length > 0 && !filters.commercials.includes(sale.commercial)) return false;
            if (filters.attribution.length > 0 && !filters.attribution.includes(sale.attribution)) return false;
            if (filters.locations.length > 0 && !filters.locations.includes(sale.location)) return false;
            if (filters.status.length > 0 && !filters.status.includes(sale.status)) return false;
            if (filters.stage.length > 0 && !filters.stage.includes(sale.stage)) return false;
            if (filters.solutions.length > 0 && !filters.solutions.includes(sale.solution)) return false;

            return true;
        });
    }, [allSales, filters]);

    return (
        <FilterContext.Provider value={{ filters, setFilters, filteredSales, allSales, loading, uniqueValues }}>
            {children}
        </FilterContext.Provider>
    );
};
