import NetInfo from '@react-native-community/netinfo';
import axios, { InternalAxiosRequestConfig } from "axios";
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Toast from "react-native-toast-message";
const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    // baseURL: 'http://xxx.2.3.160:8000/api',
    // baseURL: 'http://192.168.73.74:8080/api',
    timeout: 90000
})

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    let token: string | null = null;

    if (Platform.OS === 'web') {
        token = localStorage.getItem('userToken')
    } else {
        token = await SecureStore.getItemAsync('userToken');
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const statusNetwork = await NetInfo.fetch()

    if (!statusNetwork.isConnected) {
        Toast.show({
            type: 'error',
            text1: 'Sin Conexión',
            text2: 'No tienes internet. Por favor verifica tu red Wi-Fi o datos móviles.'
        })
        return Promise.reject(new Error("SIN_INTERNET"));
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si la petición fue rechazada por el interceptor de arriba
        if (error.message === "SIN_INTERNET") {
            return Promise.reject(error);
        }

        // ERR_NETWORK ocurre cuando el servidor IIS está apagado o Reverb no responde
        // if (error.code === 'ERR_NETWORK' || !error.response) {
        //     Toast.show({
        //         type: 'error',
        //         text1: 'Servidor no disponible',
        //         text2: 'Estamos experimentando problemas técnicos. Inténtalo más tarde.'
        //     })
        // }

        return Promise.reject(error);
    }
)

export default api