import { useState, useEffect, useMemo } from 'react';
import { Sale, CommercialMetric, Period } from '../types';
import { fetchSalesData, filterSalesByPeriod } from '../services/dataService';

export const useSalesData = () => {
    const [allSales, setAllSales] = useState<Sale[]>([]);
    const [period, setPeriod] = useState<Period>('month');
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [loading, setLoading] = useState<boolean>(true);

    // Poll data every 60 seconds
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchSalesData();
            setAllSales(data);
            setLastUpdated(new Date());
            setLoading(false);
        };

        loadData();
        const interval = setInterval(loadData, 60000);
        return () => clearInterval(interval);
    }, []);

    const { filteredSales, metrics } = useMemo(() => {
        const filtered = filterSalesByPeriod(allSales, period);

        // Group by Commercial
        const commercialMap = new Map<string, Sale[]>();

        filtered.forEach(sale => {
            const name = sale.commercial || 'Desconocido';
            if (!commercialMap.has(name)) {
                commercialMap.set(name, []);
            }
            commercialMap.get(name)?.push(sale);
        });

        const calculatedMetrics: CommercialMetric[] = [];

        commercialMap.forEach((sales, commercialName) => {
            const wonDeals = sales.filter(s => s.status === 'Ganado');
            const lostDeals = sales.filter(s => s.status === 'Perdido');
            const openDeals = sales.filter(s => s.status !== 'Ganado' && s.status !== 'Perdido');

            const revenue = wonDeals.reduce((sum, s) => sum + s.revenue, 0);
            const totalClosed = wonDeals.length + lostDeals.length;
            const winRate = totalClosed > 0 ? (wonDeals.length / totalClosed) * 100 : 0;

            // Avg Days to Close (only for won deals)
            const totalDays = wonDeals.reduce((sum, s) => sum + (s.daysToClose || 0), 0);
            const avgDays = wonDeals.length > 0 ? totalDays / wonDeals.length : 0;

            calculatedMetrics.push({
                commercial: commercialName,
                totalRevenue: revenue,
                wonCount: wonDeals.length,
                lostCount: lostDeals.length,
                winRate,
                avgDaysToClose: avgDays,
                openDeals: openDeals.length,
                deals: sales
            });
        });

        // Sort by Revenue DESC (Default for generic metrics list)
        calculatedMetrics.sort((a, b) => b.totalRevenue - a.totalRevenue);

        return { filteredSales: filtered, metrics: calculatedMetrics };
    }, [allSales, period]);

    return {
        allSales,
        sales: filteredSales,
        metrics,
        period,
        setPeriod,
        lastUpdated,
        loading
    };
};
