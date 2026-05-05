import { FieldValues } from "react-hook-form";

export const formatDate = (date: string) => {
    if (!date) return "";

    const dateObj = new Date(date.replace(/-/g, '/'))

    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(dateObj);
}

export const formatDateTime = (date: string) => {
    if (!date) return "";

    // Convertir formato SQL (YYYY-MM-DD HH:mm:ss) a ISO (YYYY-MM-DDTHH:mm:ss)
    // Esto previene errores de "Invalid Date" en Safari y móviles
    const isoDate = date.includes(' ') ? date.replace(' ', 'T') : date;
    const dateObj = new Date(isoDate);

    // Validar si la fecha es procesable
    if (isNaN(dateObj.getTime())) return "Fecha inválida";

    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // Cambia a false si prefieres formato 24h
    }).format(dateObj);
}

export const lightenColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = ((num >> 8) & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;

    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 +
        (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
};

export const chunck = <T>(array: T[] | undefined, size: number = 3): T[][] => {
    const chunked: T[][] = [];

    if (array && array.length > 0) {
        for (let i = 0; i < array.length; i += size) {
            chunked.push(array.slice(i, i + size));
        }
        return chunked;
    }
    return []
}

export const splitTextInHalf = (text: string) => {
    const words = text.split(" ");
    const midPoint = Math.ceil(words.length / 2);

    const firstHalf = words.slice(0, midPoint).join(" ");
    const secondHalf = words.slice(midPoint).join(" ");

    return { firstHalf, secondHalf };
};

export const calcAge = (fechaNacimiento: string | undefined | null): number => {
    if (!fechaNacimiento) return 0;

    const normalizedDate = fechaNacimiento.replace(' ', 'T');
    const birthDate = new Date(normalizedDate);
    if (Number.isNaN(birthDate.getTime())) return 0;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const formatNumber = (num: string | undefined): string => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const extractFieldByArray = (allValues: FieldValues, fieldNames: string[]) => {
    const data = Object.fromEntries(
        Object.entries(allValues).filter(([key]) => fieldNames.includes(key))
    );
    return data;
}