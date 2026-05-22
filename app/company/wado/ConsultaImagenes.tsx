import Button from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { LoadingModal } from '@/components/LoadingModal';
import TitleApp from '@/components/TitleApp';
import { useAsyncFormHandler } from '@/hook/useAsyncFormHandler';
import { type ConsultaImagenesData, consultaImagenesSchema } from '@/schemas/consultaImagenes.schema';
import { getWadoUrl } from '@/services/wado.service';
import { globalStyles } from '@/styles/style';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

/**
 * Pantalla de Consulta de Imágenes Médicas.
 * 
 * Permite a los pacientes acceder a sus estudios radiológicos mediante la generación 
 * de una URL de visor WADO (DICOM) basada en parámetros de facturación.
 * 
 * @module Screens/Images/ConsultaImagenes
 */

/**
 * Componente funcional para la obtención de enlaces WADO.
 * 
 * @requires React-Native/Linking - Para abrir el visor de imágenes en el navegador externo.
 * @requires React-Hook-Form - Gestión de los campos 'ordinal' y 'consecutivo'.
 * @requires Zod - Validación de longitud y tipo de dato (consultaImagenesSchema).
 */
export default function ConsultaImagenes() {
    /** 
     * Estado local para persistir la URL obtenida.
     * Permite mostrar las opciones de copiar y compartir después de la consulta exitosa.
     */
    const [enlace, setEnlace] = useState<string>('');
    const methods = useForm<ConsultaImagenesData>({
        resolver: zodResolver(consultaImagenesSchema),
        defaultValues: {
            ordinal: '',
            consecutivo: ''
        }
    });

    /**
         * Hook personalizado para manejar el envío asíncrono.
         * @returns {execute} Función que envuelve la llamada a la API.
         * @returns {isLoading} Estado de carga para el LoadingModal.
     */
    const { isLoading, execute } = useAsyncFormHandler();

    /**
     * Procesa la consulta del enlace médico.
     * 
     * 1. Llama al servicio `getWadoUrl` enviando los parámetros validados.
     * 2. Si la respuesta es exitosa, dispara una redirección automática mediante `Linking` 
     *    después de un delay de 2.5s para permitir la lectura del Toast.
     * 3. Almacena el enlace en el estado para habilitar acciones secundarias.
     * 
     * @param {ConsultaImagenesData} data - Contiene 'ordinal' (máx 10) y 'consecutivo' (máx 2).
     */
    const onSubmit = async (data: ConsultaImagenesData) => {
        const response = await execute(() => getWadoUrl(data.ordinal, data.consecutivo));
        Toast.show({
            type: response.alertSeverity,
            text1: 'Idime',
            text2: response.message
        })

        if (response.alertSeverity == 'success') {
            setTimeout(() => {
                Linking.openURL(response.response?.data.enlace);
            }, 2500);
        }
    };

    /**
     * Acciones Secundarias (Post-Consulta):
     * - Ver imágenes: Reapertura manual del enlace.
     * - Copiar URL: Utiliza el Clipboard nativo para compartir fuera de la app.
     * - Compartir: Abre el diálogo nativo de compartición (Share) del sistema operativo.
     * 
     * UI:
     * - Implementa 'keyboardType=numeric' para facilitar la entrada de datos en móviles.
     * - Utiliza KeyboardAvoidingView para asegurar que el botón 'Consultar' sea siempre accesible.
     */
    return (
        <SafeAreaView style={globalStyles.container}>
            <FormProvider {...methods}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <LoadingModal visible={isLoading} />
                    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
                        <TitleApp
                            title1='Consulta tus'
                            title2='imágenes'
                        />
                        {/* Formulario */}
                        <View style={styles.form}>
                            <View>
                                <Input
                                    label='Ingresa el ordinal'
                                    name='ordinal'
                                    placeholder='Ordinal'
                                    keyboardType='numeric'
                                    maxLength={10}
                                />
                            </View>

                            <View>
                                <Input
                                    label='Ingresa el consecutivo'
                                    name='consecutivo'
                                    placeholder='Consecutivo'
                                    keyboardType='numeric'
                                    maxLength={2}
                                />
                            </View>

                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}>
                                <Button title='Consultar'
                                    onPress={methods.handleSubmit(onSubmit)} disabled={isLoading} />
                            </View>

                            <View>
                                {enlace ? (
                                    <View style={{ marginTop: 20, gap: 10 }}>
                                        <TouchableOpacity
                                            // style={styles.linkButton}
                                            onPress={() => Linking.openURL(enlace)}
                                        >
                                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Ver imágenes</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            // style={styles.copyButton}
                                            onPress={() => {
                                                require('react-native').Clipboard.setString(enlace);
                                                alert('URL copiada al portapapeles');
                                            }}
                                        >
                                            <Text style={{ color: '#00a6a6', fontWeight: 'bold', fontSize: 16 }}>Copiar URL</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            // style={styles.shareButton}
                                            onPress={() => require('react-native').Share.share({ message: enlace })}
                                        >
                                            <Text style={{ color: '#00a6a6', fontWeight: 'bold', fontSize: 16 }}>Compartir</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : null}
                            </View>

                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </FormProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 30 },
    titleSection: { marginBottom: 40 },
    title: { fontSize: 32, color: '#334155', lineHeight: 40 },
    orangeLine: { width: 60, height: 5, backgroundColor: '#ff9900', marginTop: 10 },
    form: { width: '100%' },
});
