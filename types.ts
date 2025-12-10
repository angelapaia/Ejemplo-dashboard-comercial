export type SaleStatus = 'Ganado' | 'Perdido' | 'Abierto' | 'Cierre' | 'Negociación' | 'Cualificación' | 'Primer contacto';

export interface Sale {
  id: string;
  location: string;
  registrationDate: Date; // Fecha Registro
  clientName: string; // Nombre completo
  phone: string;
  solution: string; // Solucion
  status: SaleStatus; // Estado
  attribution: string; // Atribucion
  commercial: string; // Comercial
  stage: string; // Etapa
  wonLostDate?: Date; // Fecha ganado/perdido
  daysToClose?: number; // Tiempo en ganarse (dias)
  callsOutgoing?: number;
  callsIncomingFailed?: number;
  whatsappAnswered?: number;
  callDuration?: number;
  lossReason?: string;
  revenue: number; // Ingresos
}

export interface CommercialMetric {
  commercial: string;
  totalRevenue: number;
  wonCount: number;
  lostCount: number;
  winRate: number; // percentage 0-100
  avgDaysToClose: number;
  openDeals: number;
  deals: Sale[];
}

export type Period = 'today' | 'week' | 'month' | 'year';

export interface DashboardContextType {
  period: Period;
  setPeriod: (p: Period) => void;
  sales: Sale[]; // Raw data filtered by period
  lastUpdated: Date;
  metrics: CommercialMetric[]; // Aggregated data
}