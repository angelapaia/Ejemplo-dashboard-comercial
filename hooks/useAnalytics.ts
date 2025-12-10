import { useMemo } from 'react';
import { useFilter } from '../context/FilterContext';
import { differenceInDays } from 'date-fns';

export const useAnalytics = () => {
    const { filteredSales } = useFilter();

    const metrics = useMemo(() => {
        const totalLeads = filteredSales.length;
        const won = filteredSales.filter(s => s.status === 'Ganado');
        const lost = filteredSales.filter(s => s.status === 'Perdido');
        const open = filteredSales.filter(s => s.status === 'Abierto');

        // Revenue
        const totalRevenue = won.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
        const avgTicket = won.length > 0 ? totalRevenue / won.length : 0;

        // Time
        const closedWonWithDays = won.filter(s => typeof s.daysToClose === 'number');
        const totalDays = closedWonWithDays.reduce((acc, curr) => acc + (curr.daysToClose || 0), 0);
        const avgDaysToClose = closedWonWithDays.length > 0 ? totalDays / closedWonWithDays.length : 0;

        // Rates
        const winRate = (won.length + lost.length) > 0
            ? (won.length / (won.length + lost.length)) * 100
            : 0;

        const conversionRate = totalLeads > 0 ? (won.length / totalLeads) * 100 : 0;

        // Effort (Approximation based on available columns)
        // "(llamadas salientes + WhatsApps contestados) / nº de leads"
        const totalCalls = filteredSales.reduce((acc, s) => acc + (s.callsOutgoing || 0), 0);
        const totalWhats = filteredSales.reduce((acc, s) => acc + (s.whatsappAnswered || 0), 0);
        const avgEffort = totalLeads > 0 ? (totalCalls + totalWhats) / totalLeads : 0;

        return {
            totalLeads,
            wonCount: won.length,
            lostCount: lost.length,
            openCount: open.length,
            totalRevenue,
            avgTicket,
            avgDaysToClose,
            winRate,
            conversionRate,
            avgEffort,
            // Helper lists for Charts
            wonSales: won,
            byDate: filteredSales // For time series
        };
    }, [filteredSales]);

    return metrics;
};
