import { LoadingModal } from '@/components/LoadingModal';
import PatientCardInfo from '@/components/PatientCardInfo';
import { IResult } from '@/interfaces/IResult';
import { downloadResultPdf, getDeliveryResults } from '@/services/deliveryResults.service';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

/**
 * Pantalla de Expediente y Resultados del Paciente.
 * 
 * Centraliza la información demográfica del usuario autenticado y lista sus 
 * órdenes médicas, permitiendo la previsualización de estados y descarga de documentos.
 * 
 * @module Screens/Patient/PatientDashboard
 */

/**
 * Componente funcional para el Dashboard de resultados.
 * 
 * @requires Expo-FileSystem - Para la creación y escritura de archivos PDF en el caché local.
 * @requires Expo-Sharing - Para disparar el diálogo nativo de compartir/guardar archivos.
 * @requires React-Native-Reanimated - Animaciones de entrada escalonadas para las tarjetas.
 */
const PatientDashboard = () => {

    /** 
     * Estado que almacena la respuesta íntegra del API (Datos personales + Lista de exámenes).
     */
    const [dataApi, setDataApi] = useState<IResult | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const abrirWeb = () => {
        Linking.openURL('https://idime.com.co/');
    };

    /**
     * Orquestador de descarga de resultados.
     * 
     * 1. Solicita el PDF en base64 al servidor mediante el 'ordinal' de la orden.
     * 2. Delega la persistencia y apertura a la función 'guardarYCompartir'.
     * 
     * @param {string} ordinal - Identificador único de la orden médica.
     */
    const downloadPdf = async (ordinal: string) => {
        try {
            setLoading(true)
            const response = await downloadResultPdf(ordinal)

            if (response.byteLength === 0) {
                throw new Error("El archivo recibido está vacío.");
            }

            const archivo = new File(Paths.cache, `resultado_${ordinal}.pdf`);
            const pdfData = new Uint8Array(response);
            await archivo.write(pdfData);
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(archivo.uri, {
                    mimeType: 'application/pdf',
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Toast.show({
                type: 'error',
                text1: 'Idime',
                text2: 'Ocurrió un fallo al descargar el archivo, por favor intente más tarde'
            })
        } finally {
            setLoading(false)
        }
    }

    /**
    * Ciclo de vida: Carga inicial.
    * Al montar el componente, consume 'getDeliveryResults' para obtener el histórico 
    * de órdenes del paciente logueado.
    */
    useEffect(() => {
        const getDeliveryResultsFn = async () => {
            setLoading(true)
            const response = await getDeliveryResults()
            setDataApi(response)
            setLoading(false)
        }
        getDeliveryResultsFn()
    }, [])

    /**
     * UI y Experiencia de Usuario:
     * - Tarjeta de Expediente: Muestra datos calculados dinámicamente (Edad) y formateados (Cédula).
     * - Estado Vacío: Si no hay datos, renderiza una vista informativa con animaciones de opacidad 
     *   y acceso directo a soporte vía web externa.
     * - Lista de Órdenes: Renderizado dinámico de tarjetas maestros-detalles con indicadores de color 
     *   según la disponibilidad del resultado (Completo/Pendiente).
     */
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <PatientCardInfo />
                <LoadingModal visible={loading} />
                <View>
                    <Text style={styles.title_label}>RESULTADOS DE EXÁMENES</Text>
                </View>

                {
                    (dataApi?.data && dataApi?.data.length > 0) ?
                        dataApi?.data.map((result, index) => (
                            <Animated.View key={`master-${index}`} entering={FadeInRight.delay(200 * index)}>
                                <View style={{
                                    backgroundColor: 'white',
                                    borderRadius: 20,
                                    padding: 25,
                                    marginBottom: 20,
                                    elevation: 3,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.1,
                                    shadowRadius: 10
                                }}>
                                    {/* Order Section */}
                                    <View style={styles.orderHeader}>
                                        <TouchableOpacity style={styles.orderIconBox} onPress={() => downloadPdf(result.ordinal)}>
                                            <Feather name="download" color="#2D7A78" size={20} />
                                        </TouchableOpacity>
                                        <View>
                                            <Text style={styles.orderTitle}>{result.num_ref}</Text>
                                            <Text style={styles.orderSub}>{result.fec_factura}</Text>
                                        </View>
                                    </View>
                                    {
                                        result.detalles.map((detalle, idx) => (
                                            <ExamItem key={`detalle-${idx}`}
                                                title={detalle.nom_examen}
                                                status={detalle.has_result ? "COMPLETO" : "PENDIENTE"}
                                                color={detalle.has_result ? "#2D7A78" : "#F59E0B"}
                                            />
                                        ))
                                    }
                                </View>
                            </Animated.View>
                        ))
                        :
                        <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
                            <MaterialCommunityIcons name="file-search-outline" size={100} color="#cbd5e1" />

                            <View style={styles.card}>
                                <View style={styles.row}>
                                    <View style={styles.dot} />
                                    <Text style={styles.text}>Nuestro sistema no registra ningún resultado para ti.</Text>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.dot} />
                                    <Text style={styles.text}>
                                        Si consideras que hay un error, te invitamos a ponerte en contacto con la sede más cercana.
                                    </Text>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.dot} />
                                    <TouchableOpacity onPress={abrirWeb}>
                                        <Text style={styles.text}>
                                            Consulta nuestros teléfonos y sedes en
                                            <Text style={styles.link}> www.idime.com.co</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                }
            </ScrollView>
        </View>
    );
};

// Componente reutilizable para los exámenes
interface ExamenItemProps {
    title: string;
    status: string;
    color: string;
}
const ExamItem = ({ title, status, color }: ExamenItemProps) => (
    <View style={styles.examCard}>
        <View style={[styles.progressBar, { width: '100%', backgroundColor: color }]} />
        <View style={styles.examInfo}>
            <View style={styles.examHeader}>
                <Text style={styles.examTitle}>{title}</Text>
                <View style={styles.statusRow}>
                    <Text style={[styles.examStatus, { color }]}>{status}</Text>
                </View>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    avatarCircle: { width: 35, height: 35, borderRadius: 17, backgroundColor: '#444', justifyContent: 'center', alignItems: 'center' },
    content: { padding: 20 },
    title_label: { fontSize: 15, color: '#64748B', fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
    statusBadge: {
        backgroundColor: '#065F46',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignSelf: 'flex-start'
    },
    statusText: { color: 'white', fontWeight: 'bold', marginLeft: 5, fontSize: 12 },
    updateText: { fontSize: 10, color: '#94A3B8', marginTop: 10, textAlign: 'center' },
    orderHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    orderIconBox: { backgroundColor: '#E2E8F0', padding: 10, borderRadius: 10, marginRight: 15 },
    orderTitle: { fontSize: 16, fontWeight: 'bold' },
    orderSub: { fontSize: 12, color: '#64748B' },
    examCard: { backgroundColor: 'white', borderRadius: 10, marginBottom: 12, overflow: 'hidden' },
    progressBar: { height: 2 },
    examInfo: { paddingVertical: 8, paddingHorizontal: 10 },
    examHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    examTitle: { fontWeight: 'bold', fontSize: 14, maxWidth: '80%' },
    statusRow: { flexDirection: 'row', alignItems: 'center' },
    examStatus: { fontSize: 10, fontWeight: 'bold', marginRight: 5 },
    examDetail: { fontSize: 12, color: '#64748B', marginTop: 5 },
    progressText: { textAlign: 'right', fontSize: 10, fontWeight: 'bold', color: '#94A3B8' },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, elevation: 3 },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff9900', // El naranja de tu tabla original
        marginTop: 6,
        marginRight: 12
    },
    text: {
        flex: 1,
        fontSize: 15,
        color: '#475569',
        lineHeight: 22
    },
    link: {
        color: '#00a6a6',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    closeBtn: { marginTop: -10 },
});

export default PatientDashboard;
