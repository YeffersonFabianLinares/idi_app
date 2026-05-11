import { IResult } from "@/interfaces/IResult";
import api from "@/plugins/axios";

export const getDeliveryResults = async () => {
    try {
        const response = await api.get<IResult>(`/delivery-results`)
        return response.data;
    }
    catch (error) {
        console.error('Error al obtener los resultados de entrega: ', error);
        throw error;
    }
}

export const downloadResultPdf = async (ordinal: string) => {
    try {
        const response = await api.get(`/download-results`, {
            params: { ordinal: ordinal },
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'application/pdf'
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('Error al descargar el PDF: ', error);
        throw error;
    }
}