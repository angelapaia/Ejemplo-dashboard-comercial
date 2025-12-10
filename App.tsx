import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Podium } from './components/Podium';
import { RankingTable } from './components/RankingTable';
import { KPIGrid } from './components/KPIGrid';
import { SalesTicker } from './components/SalesTicker';
import { fetchSalesData } from './services/googleSheets';
import { SaleRecord, SaleStatus, Period, CommercialStats } from './types';
import { REFRESH_INTERVAL_MS, TEAM_MONTHLY_GOAL } from './constants';
import { isSameDay, subDays, startOfDay, endOfDay, isWithinInterval, parseISO, format } from 'date-fns';

const App: React.FC = () => {
  const [allSales, setAllSales] = useState<SaleRecord[]>([]);
  // Default to today as requested
  const [period, setPeriod] = useState<Period>(Period.Today);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  // Custom Date Range State
  const [customStartDate, setCustomStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [customEndDate, setCustomEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Data Fetching Loop
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSalesData();
        setAllSales(data);
        setLastUpdated(new Date());
        setLoading(false);
      } catch (error) {
        console.error("Error loading data", error);
        setLoading(false);
      }
    };

    loadData(); // Initial load
    const intervalId = setInterval(loadData, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  // Filter Sales by Period
  const filteredSales = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);

    return allSales.filter(sale => {
      const saleDate = sale.date;
      
      switch (period) {
        case Period.Today:
            return isSameDay(saleDate, now);
        
        case Period.Yesterday:
            return isSameDay(saleDate, subDays(now, 1));
        
        case Period.Last7Days:
            return isWithinInterval(saleDate, {
                start: subDays(today, 6), // 6 days ago + today = 7 days
                end: endOfDay(now)
            });

        case Period.Last30Days:
            return isWithinInterval(saleDate, {
                start: subDays(today, 29),
                end: endOfDay(now)
            });

        case Period.Custom:
            if (!customStartDate || !customEndDate) return true;
            return isWithinInterval(saleDate, {
                start: startOfDay(parseISO(customStartDate)),
                end: endOfDay(parseISO(customEndDate))
            });

        default: // Fallback
            return true;
      }
    });
  }, [allSales, period, customStartDate, customEndDate]);

  // Aggregate Data for Stats
  const commercialStats = useMemo(() => {
    const statsMap: Record<string, CommercialStats> = {};

    filteredSales.forEach(sale => {
        if (!statsMap[sale.comercial]) {
            statsMap[sale.comercial] = {
                name: sale.comercial,
                totalRevenue: 0,
                wonCount: 0,
                lostCount: 0,
                winRate: 0,
                avgDaysToClose: 0
            };
        }
    });

    filteredSales.forEach(sale => {
        const stat = statsMap[sale.comercial];
        if (sale.status === SaleStatus.Won) {
            stat.totalRevenue += sale.revenue;
            stat.wonCount += 1;
        } else if (sale.status === SaleStatus.Lost) {
            stat.lostCount += 1;
        }
    });

    return Object.values(statsMap).map(stat => {
        const totalClosed = stat.wonCount + stat.lostCount;
        stat.winRate = totalClosed > 0 ? Math.round((stat.wonCount / totalClosed) * 100) : 0;
        return stat;
    });
  }, [filteredSales]);

  // Sorting Logic
  const sortedStats = useMemo(() => {
    return [...commercialStats].sort((a, b) => {
        if (b.totalRevenue !== a.totalRevenue) return b.totalRevenue - a.totalRevenue;
        if (b.wonCount !== a.wonCount) return b.wonCount - a.wonCount;
        return b.winRate - a.winRate;
    });
  }, [commercialStats]);

  const top3 = sortedStats.slice(0, 3);
  
  const teamTotalRevenue = sortedStats.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const teamTotalSales = sortedStats.reduce((acc, curr) => acc + curr.wonCount, 0);
  
  // Recent sales should just be the global recent won sales to keep the ticker lively,
  // regardless of the filter applied to the main dashboard.
  const recentWonSales = useMemo(() => {
      return [...allSales]
        .filter(s => s.status === SaleStatus.Won)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 15);
  }, [allSales]);

  if (loading && allSales.length === 0) {
    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <p className="font-light tracking-widest uppercase text-sm">Cargando...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col overflow-hidden font-sans selection:bg-white selection:text-black">
      <Header 
        currentPeriod={period} 
        setPeriod={setPeriod} 
        lastUpdated={lastUpdated}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
      />

      {/* Main Content Grid */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 pb-16">
        
        {/* Left Zone: Podium */}
        <section className="col-span-12 lg:col-span-7 bg-neutral-900/50 rounded-2xl border border-neutral-800 relative overflow-hidden flex flex-col">
          <div className="p-4 z-10">
            <h2 className="text-xl font-light text-center text-neutral-400 uppercase tracking-[0.2em] mb-4">Líderes de Ventas</h2>
            <div className="flex-1 h-full min-h-[400px]">
                 <Podium top3={top3} />
            </div>
          </div>
        </section>

        {/* Right Zone: Ranking Table */}
        <section className="col-span-12 lg:col-span-5 h-full min-h-[400px]">
          <RankingTable data={sortedStats} />
        </section>

        {/* Bottom Zone: KPIs */}
        <section className="col-span-12 h-40">
           <KPIGrid 
             totalRevenue={teamTotalRevenue} 
             totalSales={teamTotalSales}
             goal={TEAM_MONTHLY_GOAL}
             topCommercialName={top3[0]?.name}
             topCommercialRevenue={top3[0]?.totalRevenue}
           />
        </section>

      </main>

      <SalesTicker recentSales={recentWonSales} />
    </div>
  );
};

export default App;