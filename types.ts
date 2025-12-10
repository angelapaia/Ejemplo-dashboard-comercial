export enum SaleStatus {
  Won = 'Ganado',
  Lost = 'Perdido',
  Open = 'Abierto'
}

export enum Period {
  Today = 'HOY',
  Yesterday = 'AYER',
  Last7Days = 'ÚLTIMOS 7 DÍAS',
  Last30Days = 'ÚLTIMOS 30 DÍAS',
  Custom = 'PERSONALIZADO'
}

export interface RawSaleRecord {
  Comercial: string;
  Estado: string;
  Ingresos: string;
  'Fecha ganado/perdido': string;
  'Fecha Registro'?: string;
  'Tiempo en ganarse (dias)'?: string;
  Solucion?: string;
  Ubicacion?: string;
  [key: string]: string | undefined;
}

export interface SaleRecord {
  id: string;
  comercial: string;
  status: SaleStatus;
  revenue: number;
  date: Date;
  daysToClose: number;
  solution: string;
  location: string;
}

export interface CommercialStats {
  name: string;
  totalRevenue: number;
  wonCount: number;
  lostCount: number;
  winRate: number; // 0-100
  avgDaysToClose: number;
}