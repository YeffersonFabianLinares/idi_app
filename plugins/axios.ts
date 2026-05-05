import axios, { InternalAxiosRequestConfig } from "axios";
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
const api = axios.create({
    baseURL: 'http://10.2.3.160:8000/api',
    timeout: 10000
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
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api