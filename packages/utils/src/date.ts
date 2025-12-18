import { format, parseISO } from 'date-fns';

export const formatDate = (date: string | Date | null | undefined, formatStr: string = 'PP'): string => {
    if (!date) return 'N/A';

    const d = typeof date === 'string' ? parseISO(date) : date;

    try {
        return format(d, formatStr);
    } catch (e) {
        return 'Invalid Date';
    }
};
