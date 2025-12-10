import Papa from 'papaparse';
import { Sale, SaleStatus } from '../types';
import { startOfDay, startOfWeek, startOfMonth, startOfYear, isWithinInterval, parse, isValid } from 'date-fns';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/17OzrRnZaNo36bIwU48OirJCgtgD5cX-taAjL07vB0c8/export?format=csv';

// Interface matching the exact CSV headers (to be safe)
interface CsvRow {
    'ID contacto': string;
    'Ubicacion': string;
    'Fecha Registro': string;
    'Nombre completo': string;
    'teléfono': string;
    'Solucion': string;
    'Estado': string;
    'Atribucion': string;
    'Comercial': string;
    'Etapa': string;
    'Fecha ganado/perdido': string;
    'Tiempo en ganarse (dias)': string;
    'Nº de llamadas salientes': string;
    'Nº de llamadas entrantes (fallidas)': string;
    'Nº de whatsapp contestados': string;
    'Duración llamada': string;
    'Motivo perdida': string;
    'Ingresos': string;
    'Solución': string; // Note: There might be duplicate columns in source
}

export const fetchSalesData = async (useLocalMock = false): Promise<Sale[]> => {
    try {
        const url = useLocalMock ? '/mock_sales.csv' : GOOGLE_SHEET_CSV_URL;

        // In a real browser environment, we might fetch(); 
        // For this environment, since we can't easily perform a collection of client-side fetches without a proxy often,
        // we assume this runs in the client browser. 
        // However, if we hit CORS issues with the Google Sheet "publish to web", we might need a proxy or different approach.
        // "Publish to web" usually supports CORS for GET.

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const csvText = await response.text();

        return parseCsvData(csvText);

    } catch (error) {
        console.error("Error fetching sales data:", error);
        return [];
    }
};

export const parseCsvData = (csvText: string): Sale[] => {
    const results = Papa.parse<CsvRow>(csvText, {
        header: true,
        skipEmptyLines: true,
    });

    return results.data.map(row => mapRowToSale(row)).filter(sale => sale.id); // Filter out empty or invalid rows
};

const parseDate = (dateString: string): Date => {
    if (!dateString) return new Date(0); // Invalid or empty date

    // Try common formats seen in the CSV: "d/M/yyyy H:mm:ss"
    // Example: "2/12/2025 13:27:14"
    const formatString = 'd/M/yyyy H:mm:ss';
    let parsedParams = parse(dateString, formatString, new Date());

    if (isValid(parsedParams)) return parsedParams;

    // Fallback or just return current date/invalid date
    return new Date();
}

const parseNumber = (numStr: string): number => {
    if (!numStr) return 0;
    // Remove currency symbols, cleaning strings like "2.500 €" or "1,200" if necessary
    // Spanish format often uses '.' for thousands and ',' for decimals, or vice versa depending on locale settings.
    // However, CSV raw data usually comes without formatting unless exported as "Display Values".
    // Observing the user provided CSV snippet: "5900", "2250". It seems to be raw integers/floats.

    const cleanStr = numStr.replace(/[^0-9.-]/g, '');
    const val = parseFloat(cleanStr);
    return isNaN(val) ? 0 : val;
}

const mapRowToSale = (row: CsvRow): Sale => {
    return {
        id: row['ID contacto'] || Math.random().toString(36),
        location: row['Ubicacion'] || '',
        registrationDate: parseDate(row['Fecha Registro']),
        clientName: row['Nombre completo'] || 'Unknown',
        phone: row['teléfono'] || '',
        solution: row['Solucion'] || row['Solución'] || '',
        status: (row['Estado'] as SaleStatus) || 'Abierto',
        attribution: row['Atribucion'] || '',
        commercial: row['Comercial'] || 'Unassigned',
        stage: row['Etapa'] || '',
        wonLostDate: row['Fecha ganado/perdido'] ? parseDate(row['Fecha ganado/perdido']) : undefined,
        daysToClose: row['Tiempo en ganarse (dias)'] ? parseNumber(row['Tiempo en ganarse (dias)']) : undefined,
        callsOutgoing: parseNumber(row['Nº de llamadas salientes']),
        callsIncomingFailed: parseNumber(row['Nº de llamadas entrantes (fallidas)']),
        whatsappAnswered: parseNumber(row['Nº de whatsapp contestados']),
        callDuration: parseNumber(row['Duración llamada']),
        lossReason: row['Motivo perdida'] || '',
        revenue: parseNumber(row['Ingresos']),
    };
};

export const filterSalesByPeriod = (sales: Sale[], period: string): Sale[] => {
    const now = new Date();
    let start: Date;

    switch (period) {
        case 'today':
            start = startOfDay(now);
            break;
        case 'week':
            start = startOfWeek(now, { weekStartsOn: 1 }); // Start on Monday
            break;
        case 'month':
            start = startOfMonth(now);
            break;
        case 'year':
            start = startOfYear(now);
            break;
        default:
            return sales;
    }

    return sales.filter(sale => {
        // Filter primarily by "Won/Lost Date" if it exists and status is finalized, 
        // otherwise maybe Registration Date? 
        // User spec: "Todas las métricas ... se calculan en función de este periodo."
        // Usually for Sales Dashboards, we care about when the sale was WON.
        if (sale.status === 'Ganado' && sale.wonLostDate) {
            return sale.wonLostDate >= start;
        }
        // If we want to see activities or new leads in that period too:
        // Adjust logic if user wants "New Leads" vs "Closed Sales".
        // For the Ranking/Podium of REVENUE, we definitely only count WON deals in that period.

        // However, user also asked for "Nº de oportunidades perdidas" in metrics.
        if (sale.status === 'Perdido' && sale.wonLostDate) {
            return sale.wonLostDate >= start;
        }

        // For "Abierto", maybe we don't filter or we filter by creation date?
        // Let's assume for the RANKING (Revenue), we purely look at Won Date. 
        // We will return ALL relevant sales for the period calculations.

        // Safest bet: If it has a won/lost date, use that. If it is open, use registration date?
        // Let's stick to: If status is Won/Lost, check WonLostDate.

        if (sale.wonLostDate) {
            return sale.wonLostDate >= start;
        }

        // If no won/lost date (e.g. Open deals), maybe exclude from "Period Revenue" calculations but keep in "Pipeline"?
        return false;
    });
};
