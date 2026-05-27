import { LoadingModal } from '@/components/LoadingModal';
import ModalConfirm from '@/components/ModalConfirm';
import NoResult from '@/components/NoResult';
import PatientCardInfo from '@/components/PatientCardInfo';
import { useAsyncFormHandler } from '@/hook/useAsyncFormHandler';
import { cancelAppoinment, generatePreparations, getAppoinmentsByPatient } from '@/services/appoinment.service';
import { globalStyles } from '@/styles/style';
import { getStatusName } from '@/utils/helpers';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // O usa react-native-vector-icons
import { File, Paths } from 'expo-file-system';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

/**
 * Componente de pantalla para la gestión y visualización de citas médicas del paciente.
 * 
 * Permite listar las citas activas, visualizar detalles de sede/examen, descargar 
 * preparaciones médicas en formato PDF (con soporte multiplataforma) y realizar 
 * cancelaciones interactivas mediante un flujo con modal de confirmación.
 * 
 */
export default function ShowAppoinments() {

    const [appoinemnts, setAppoinments] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const { execute, isLoading } = useAsyncFormHandler()

    const [isVisible, setModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    /**
     * Consulta las citas médicas vigentes del paciente en la base de datos Oracle
     * a través del servicio correspondiente y actualiza el estado local.
     * @async
     * @returns {Promise<void>}
     */
    const getAppoinmentsByPatientFn = async () => {
        const response = await getAppoinmentsByPatient()
        setAppoinments(response)
    }

    /**
     * Prepara el flujo de cancelación de una cita médica. 
     * Almacena los datos de la cita y despliega el modal de confirmación en pantalla.
     * @param {any} data Objeto completo de la cita o identificador estructurado.
     */
    const handleCancelAppoinment = async (data: any) => {
        setModalVisible(true)
        setSelectedAppointment(data)
    }

    /**
     * Procesa la confirmación de la cancelación.
     * Ejecuta el servicio HTTP de anulación bajo el estado seguro del hook,
     * muestra un Toast informativo según la severidad de la respuesta, refresca la lista y cierra el modal.
     * @async
     * @returns {Promise<void>}
     */
    const onConfirm = async () => {
        const response = await execute(
            () => cancelAppoinment(selectedAppointment)
        )

        Toast.show({
            type: response.alertSeverity,
            text1: 'Idime',
            text2: response.message,
            visibilityTime: 1800
        })
        getAppoinmentsByPatientFn()
        setModalVisible(false)
    }

    /**
     * Descarga y procesa las guías de preparación médica asociadas a la cita.
     * Recupera el binario (ArrayBuffer/Blob), genera un archivo físico temporal en el caché 
     * del dispositivo y lo lanza visualmente según el sistema operativo del teléfono.
     * 
     * - **Android**: Resuelve la URI mediante `ContentProvider` heredado para lanzar un Intent nativo de PDF.
     * - **iOS**: Abre la hoja nativa de compartir (`UIActivityViewController`) para previsualizar el archivo.
     * 
     * @async
     * @param {any} data Datos de la cita requeridos para la consulta (debe contener `.ordinal`).
     * @throws {Error} Si la respuesta del servidor es nula o vacía.
     * @returns {Promise<void>}
     */
    const downloadPreparations = async (data: any) => {
        try {
            setLoading(true);
            const response = await generatePreparations(data);

            if (!response || response.byteLength === 0) throw new Error("Vacío");

            const fileName = `preparacion_${data.ordinal}.pdf`;
            const archivo = new File(Paths.cache, fileName);
            await archivo.write(new Uint8Array(response));

            if (Platform.OS === 'android') {
                // Usamos la API legacy que es la que realmente tiene el método funcional
                const contentUri = await FileSystemLegacy.getContentUriAsync(archivo.uri);

                await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                    data: contentUri,
                    flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
                    type: 'application/pdf',
                });
            } else {
                // En iOS abrimos el menú de compartir/preview
                await Sharing.shareAsync(archivo.uri, {
                    mimeType: 'application/pdf',
                    UTI: 'com.adobe.pdf',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Idime',
                text2: 'Ocurrió un fallo al descargar el archivo, por favor intente más tarde'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAppoinmentsByPatientFn()
    }, [])

    return (
        <SafeAreaView style={globalStyles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
                <LoadingModal visible={isLoading || loading} />
                <ModalConfirm
                    isVisible={isVisible}
                    onClose={() => setModalVisible(false)}
                    onConfirm={onConfirm}
                    title='¿Cancelar cita?'
                    message='Esta acción liberará tu espacio y otros pacientes podrán tomarlo'
                />

                <PatientCardInfo />
                {
                    appoinemnts.length > 0 ?
                        (
                            <View>
                                <Text style={styles.title_label}>CITAS DEL PACIENTE</Text>
                                {appoinemnts.map((item, index) => (
                                    <View style={styles.card} key={index}>
                                        <View style={styles.header}>
                                            <View style={{ maxWidth: '80%' }}>
                                                <Text style={styles.titleText} numberOfLines={2}>{item.examen.nombre}</Text>
                                            </View>
                                            <View style={[styles.badge, { backgroundColor: item.estado === 'AC' ? '#E0F7F9' : '#F5F5F5' }]}>
                                                <Text style={styles.badgeText}>{getStatusName(item.estado)}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.infoRow}>
                                            <View style={styles.infoItem}>
                                                <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#2D6A4F" />
                                                <View style={styles.infoTextContainer}>
                                                    <Text style={styles.label}>FECHA Y HORA</Text>
                                                    <Text style={styles.value}>{item.fecha_cita}</Text>
                                                    <Text style={styles.value}>{item.hora_cita}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.infoItem}>
                                                <MaterialCommunityIcons name="map-marker-outline" size={24} color="#2D6A4F" />
                                                <View style={styles.infoTextContainer}>
                                                    <Text style={styles.label}>CLÍNICA | SEDE</Text>
                                                    <Text style={styles.value}>{item.sede.nombre}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        {
                                            item.estado === 'AC' && <>
                                                <TouchableOpacity style={styles.linkContainer} onPress={() => downloadPreparations({
                                                    ordinal: item.ordinal
                                                })}>
                                                    <MaterialCommunityIcons name="file-document-outline" size={18} color="#2D6A4F" />
                                                    <Text style={styles.linkText}>Ver preparaciones</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelAppoinment({ ordinal: item.ordinal })}>
                                                    <Text style={styles.cancelButtonText}>CANCELAR CITA</Text>
                                                </TouchableOpacity>
                                            </>
                                        }
                                    </View>
                                ))}
                            </View>
                        )
                        :
                        <NoResult />
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        // Sombra para iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Sombra para Android
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    title_label: { fontSize: 15, color: '#64748B', fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
    typeText: { fontSize: 12, color: '#6C757D', fontWeight: '600' },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 10, color: '#00A8A8', fontWeight: 'bold' },
    titleText: { fontSize: 17, fontWeight: 'bold', color: '#212529', marginBottom: 16 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    infoItem: { flexDirection: 'row', flex: 1 },
    infoTextContainer: { marginLeft: 8 },
    label: { fontSize: 10, color: '#ADB5BD', fontWeight: 'bold' },
    value: { fontSize: 13, color: '#495057', fontWeight: '500' },
    linkContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    linkText: { color: '#2D6A4F', fontSize: 14, fontWeight: '600', marginLeft: 4, textDecorationLine: 'underline' },
    cancelButton: {
        backgroundColor: '#F8F9FA',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E9ECEF'
    },
    cancelButtonText: { color: '#D90429', fontWeight: 'bold', fontSize: 13 },
});
