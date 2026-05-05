// utils/echo.ts
import Pusher from 'pusher-js/react-native';

export const testPusherConnection = () => {
    try {
        // Configuramos Pusher manualmente sin Laravel Echo
        const pusher = new Pusher('9s3wfcipdtrcjmzztt3i', {
            wsHost: '10.2.3.160',
            wsPort: 8080,
            forceTLS: false,
            disableStats: true,
            enabledTransports: ['ws', 'wss'],
            cluster: 'mt1' // Valor dummy requerido por la librería
        });

        pusher.connection.bind('connected', () => {
        });

        pusher.connection.bind('error', (err: any) => {
            console.error('Error de conexión Pusher:', err);
        });

        return pusher;
    } catch (error) {
        console.error('Error al crear el constructor:', error);
        return null;
    }
};
