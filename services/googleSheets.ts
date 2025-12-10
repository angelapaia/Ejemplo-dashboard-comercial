import Papa from 'papaparse';
import { RawSaleRecord, SaleRecord, SaleStatus } from '../types';
import { SHEET_CSV_URL } from '../constants';

// Helper to parse currency strings like "1.200 €" or "$1,200.00"
const parseCurrency = (value: string): number => {
  if (!value) return 0;
  // Remove currency symbols and keep numbers, commas, dots
  const cleanStr = value.replace(/[^\d.,-]/g, '');
  // Replace comma with dot if it looks like a decimal separator in European format
  // Simple heuristic: if there is a comma and it's towards the end, or if multiple dots.
  // For safety with Spanish sheets: "1.200,50" -> "1200.50"
  
  let normalized = cleanStr;
  if (cleanStr.includes(',') && cleanStr.includes('.')) {
      // Assumes 1.000,00 format
      normalized = cleanStr.replace(/\./g, '').replace(',', '.');
  } else if (cleanStr.includes(',')) {
      // Assumes 1000,00 format
      normalized = cleanStr.replace(',', '.');
  }
  
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
};

// Helper to parse dates. Google Sheets CSV usually outputs YYYY-MM-DD or DD/MM/YYYY
const parseDate = (value: string): Date => {
  if (!value) return new Date();
  
  try {
    // Attempt standard constructor first (works for YYYY-MM-DD)
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;

    // Handle DD/MM/YYYY
    const parts = value.split('/');
    if (parts.length === 3) {
      // Month is 0-indexed in JS Date
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
  } catch (e) {
    console.error("Date parse error", value);
  }
  return new Date(); // Fallback to now to avoid crashing, though data will be wrong
};

export const fetchSalesData = async (): Promise<SaleRecord[]> => {
  try {
    // Add cache buster directly to the Google Sheets URL to ensure we get a fresh generation of the CSV
    const timestamp = Date.now();
    const freshSheetUrl = `${SHEET_CSV_URL}&t=${timestamp}`;

    // Use corsproxy.io to bypass CORS headers
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(freshSheetUrl)}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<RawSaleRecord>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
              console.warn("CSV Parse warnings:", results.errors);
          }
          
          const parsedData: SaleRecord[] = results.data.map((row, index) => {
            // Map Raw CSV columns to our clean interface
            const statusStr = row['Estado']?.trim() || 'Abierto';
            let status = SaleStatus.Open;
            if (statusStr.toLowerCase() === 'ganado') status = SaleStatus.Won;
            else if (statusStr.toLowerCase() === 'perdido') status = SaleStatus.Lost;

            return {
              id: `sale-${index}`,
              comercial: row['Comercial']?.trim() || 'Desconocido',
              status: status,
              revenue: parseCurrency(row['Ingresos']),
              date: parseDate(row['Fecha ganado/perdido']),
              daysToClose: parseInt(row['Tiempo en ganarse (dias)'] || '0', 10) || 0,
              solution: row['Solucion'] || row['Solución'] || '-',
              location: row['Ubicacion'] || row['Ubicación'] || '-'
            };
          });
          resolve(parsedData);
        },
        error: (err: Error) => {
          reject(err);
        }
      });
    });
  } catch (error) {
    console.error("Failed to fetch Google Sheet data", error);
    return [];
  }
};