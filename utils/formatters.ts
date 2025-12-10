import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`;
};

export const formatDate = (date: Date): string => {
    return format(date, 'dd/MM HH:mm', { locale: es });
};
