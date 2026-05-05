import api from "@/plugins/axios";
import { AuthSchema } from "@/schemas/auth.schema";

export const login = async (data: AuthSchema) => {
    const response = await api.post('/login', data)
    return response.data
}

export const logout = async () => {
    const response = await api.post('/logout')
    return response
}