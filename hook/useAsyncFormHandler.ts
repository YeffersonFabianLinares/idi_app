import type { AlertSeverity } from '@/types/AlertSeverity';
import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';

/**
 * Estructura de parámetros necesarios para enviar petición store o update a API
 * 
 * @category Interfaces
 */
export interface AsyncState {
    /** Comprobar si la petición axios se encuentra aún en ejecución */
    isLoading: boolean,
    /** Mensaje que regresa el servidor */
    alertMessage: string | null,
    /** 
     * Tipo de alerta a mostrar, puede ser info | warning | error | success 
     * @see {@link AlertSeverity} 
     */
    alertSeverity: AlertSeverity
}

/**
 * @module Hooks/useAsyncFormHandler
 * Manejador universal para peticiones asíncronas de formularios.
 */

/**
 * Hook para gestionar el ciclo de vida de peticiones asíncronas (POST/PUT/DELETE/...etc).
 * 
 * Centraliza la captura de errores, el estado de carga y la normalización de mensajes
 * provenientes de Laravel, incluyendo errores de validación (422) y errores de servidor (500).
 * 
 * @example
 * ```tsx
 * const { execute, isLoading, alertMessage } = useAsyncFormHandler();
 * 
 * const handleSubmit = async () => {
 *    const { response, alertSeverity } = await execute(() => service.store(data), "Guardado!");
 *    if (response) { // Éxito }
 * };
 * ```
 * 
 * @returns {Object} result
 * @returns {boolean} .isLoading - Estado de carga.
 * @returns {string|null} .alertMessage - Mensaje para mostrar en {@link AlertGeneric}.
 * @returns {AlertSeverity} .alertSeverity - Tipo de alerta según el resultado.
 * @returns {Function} .execute - Función envolvente para ejecutar la promesa.
 * @returns {Function} .clearAlert - Limpia el mensaje de alerta actual.
 * 
 * @category Hooks
 */
export const useAsyncFormHandler = () => {
    /** 
 * Estado reactivo de la petición.
 * @internal 
 */
    const [state, setState] = useState<AsyncState>({
        isLoading: false,
        alertMessage: null,
        alertSeverity: 'info',
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    /**
 * Ejecuta una función asíncrona y gestiona automáticamente sus estados y errores.
 * 
 * @async
 * @template T El tipo de dato que devuelve la promesa exitosa.
 * @param asyncFunction - Función que retorna la promesa de Axios.
 * @param successMessage - Mensaje personalizado para mostrar en caso de éxito.
 * @param errorMessage - Mensaje genérico en caso de fallo (opcional).
 * 
 * @returns Promesa con un objeto que contiene la `response`, el `message` final y la `alertSeverity`.
 */
    const execute = useCallback(async <T,>(
        asyncFunction: (signal: AbortSignal) => Promise<T>,
        successMessage?: string,
        errorMessage?: string
    ): Promise<{ response: T | undefined; message: string, alertSeverity: AlertSeverity }> => {

        setState({ isLoading: true, alertMessage: null, alertSeverity: 'info' });

        try {
            const response = await asyncFunction(controller.signal);
            clearTimeout(timeoutId);
            // @ts-ignore
            const successMsg: string = successMessage || response?.data?.message || 'Operación completada con éxito.';

            setState({
                isLoading: false,
                alertMessage: successMessage || 'Operación completada con éxito.',
                alertSeverity: 'success',
            });
            return { response, message: successMsg, alertSeverity: 'success' };

        } catch (err) {
            const axiosError = err as AxiosError;

            let finalErrorMessage = errorMessage || 'Ha ocurrido un error inesperado.';

            // @ts-ignore
            if (axiosError.code === 'ECONNABORTED' || err.name === 'AbortError') {
                finalErrorMessage = 'La solicitud ha tardado demasiado, intenta de nuevo más tarde (Tiempo de espera agotado).';
            }
            else if (axiosError.status) {
                if (axiosError.status >= 500) {
                    // @ts-ignore
                    finalErrorMessage = axiosError?.response?.data?.message || 'Error interno del servidor. Inténtalo más tarde.';
                } else if (axiosError.status >= 400 && axiosError.status < 500) {

                    if (axiosError.status == 422) {
                        // @ts-expect-error Warning
                        finalErrorMessage = axiosError.response?.data?.message
                    } else {
                        finalErrorMessage = 'Solicitud incorrecta o no autorizada.';
                    }
                }
            } else if (axiosError.request) {
                finalErrorMessage = 'Error de red: No se pudo conectar con el servidor.';
            }

            setState({
                isLoading: false,
                alertMessage: finalErrorMessage,
                alertSeverity: 'error',
            });
            return { response: undefined, message: finalErrorMessage, alertSeverity: 'error' };
        }
    }, []);

    const clearAlert = useCallback(() => {
        setState(prev => ({ ...prev, alertMessage: null }));
    }, []);

    const Severity = state.alertSeverity

    return {
        ...state,
        execute,
        clearAlert,
        Severity
    };
};
