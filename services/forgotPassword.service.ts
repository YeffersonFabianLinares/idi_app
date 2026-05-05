import api from "@/plugins/axios";
import { ForgotPasswordType } from "@/schemas/forgotPassword.schema";
import { ResetPasswordSchema } from "@/schemas/resetPassword.schema";

export const forgotPassword = async (data: ForgotPasswordType) => {
    try {
        const response = await api.post(`/forgot-password`, data);
        return response;
    } catch (error) {
        console.error("Error fetching WADO URL:", error);
        throw error;
    }
};

export const getDependences = async () => {
    const response = await api.get('forgot-password-dependences')
    return response.data
}

export const resetPassword = async (data: ResetPasswordSchema) => {
    const response = await api.patch('reset-password', data)
    return response
}