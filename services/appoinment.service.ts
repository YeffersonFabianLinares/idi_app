import { MenBotData } from "@/interfaces/MenBotData";
import api from "@/plugins/axios";
import { IAppoinment } from "@/schemas/appoinment.schema";

export const dependencesAppoinments = async (type: string) => {
    const response = await api.get(`/dependences-appoinments/`, { params: { type: type } });
    return response.data;
}

export const initAppoinment = async (data: any) => {
    const response = await api.post<MenBotData>(`/init-appoinment`, data);
    return response;
}

export const getDataMenbotById = async (id_menbot: string) => {
    const response = await api.get(`get-data-menbot-by-id/${id_menbot}`)
    return response.data
}

export const updateFieldsStepTwo = async (data: any) => {
    const response = await api.put(`update-fields-stepTwo`, data)
    return response
}

export const searchAppoinmentDisponibily = async (data: any) => {
    const response = await api.get('search-appoinment-disponibily', { params: data })
    return response.data
}

export const updateFieldsStepThree = async (data: any) => {
    const response = await api.put(`update-fields-stepThree`, data)
    return response
}

export const appoinmentPrepareReserved = async (data: IAppoinment) => {
    const form = {
        id_menbot: data.id_menbot,
        acepta_id: data.acepta_id
    }
    const response = await api.post('appoinment-prepare-reserved', form)
    return response
}

interface IDependencesStepFourParams {
    cod_depto: string
    cod_empresa: string
    cod_examen: string
}

export const getDependencesStepFour = async (data: IDependencesStepFourParams) => {
    const response = await api.get('get-dependences-stepFour', { params: data })
    return response.data
}

export const getAppoinmentsByPatient = async () => {
    const response = await api.get('get-appoinments-by-patient')
    return response.data
}

export const cancelAppoinment = async (data: any) => {
    const response = await api.put('cancel-appoinment', data)
    return response
}