import React from 'react';
import { StyleSheet, Text } from 'react-native';

/**
 * Mensaje tipo string recibido
 * 
 * @category Interfaces
 */
export interface ErrorMessageProps {
    /** Mensaje de error de tipo string o undefined */
    message?: string
}

/**
 * @module Hooks/components
 */

/**
 * Componente para gestionar mensajes de error de los schema zod
 * 
 * @param message - mensaje de error de los schema zod
 * 
 * @returns Un componente span de color rojo con el mensaje de error
 * @category Components
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (!message) {
        return null
    }
    return (
        <>
            <Text style={styles.errors}>
                {message}
            </Text>
        </>
    );
}

const styles = StyleSheet.create({
    errors: { fontSize: 12, color: 'red', marginTop: 4 }
})

export default ErrorMessage