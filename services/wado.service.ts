import api from "@/plugins/axios";

export const getWadoUrl = async (ordinal: string, consecutivo: string) => {
    try {
        const response = await api.get(`/get-wado-url?ordinal=${ordinal}&cons=${consecutivo}`);
        return response;
    } catch (error) {
        console.error("Error fetching WADO URL:", error);
        throw error;
    }
};