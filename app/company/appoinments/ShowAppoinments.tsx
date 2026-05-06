import { LoadingModal } from '@/components/LoadingModal';
import TitleApp from '@/components/TitleApp';
import { useAsyncFormHandler } from '@/hook/useAsyncFormHandler';
import { cancelAppoinment, getAppoinmentsByPatient } from '@/services/appoinment.service';
import { globalStyles } from '@/styles/style';
import { getStatusName } from '@/utils/helpers';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // O usa react-native-vector-icons
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function ShowAppoinments() {

    const [appoinemnts, setAppoinments] = useState<any[]>([])
    const { execute, isLoading } = useAsyncFormHandler()

    const handleCancelAppoinment = async (data: any) => {
        const response = await execute(
            () => cancelAppoinment(data)
        )
        Toast.show({
            type: response.alertSeverity,
            text1: 'Idime',
            text2: response.message,
            visibilityTime: 2000
        })
        getAppoinmentsByPatientFn()
    }

    const getAppoinmentsByPatientFn = async () => {
        const response = await getAppoinmentsByPatient()
        setAppoinments(response)
    }

    useEffect(() => {
        getAppoinmentsByPatientFn()
    }, [])

    return (
        <View style={globalStyles.container}>
            <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
                <LoadingModal visible={isLoading} />
                <TitleApp
                    title1='Citas'
                    title2='Asignadas'
                />
                {
                    appoinemnts.map((item) => (
                        <View style={styles.card}>
                            <View style={styles.header}>
                                <Text style={styles.titleText}>{item.examen.nombre}</Text>
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
                                    <TouchableOpacity style={styles.linkContainer}>
                                        <MaterialCommunityIcons name="file-document-outline" size={18} color="#2D6A4F" />
                                        <Text style={styles.linkText}>Ver preparaciones</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelAppoinment({ ordinal: item.ordinal })}>
                                        <Text style={styles.cancelButtonText}>CANCELAR CITA</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                    ))
                }
            </ScrollView>
        </View>
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
    typeText: { fontSize: 12, color: '#6C757D', fontWeight: '600' },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 10, color: '#00A8A8', fontWeight: 'bold' },
    titleText: { fontSize: 18, fontWeight: 'bold', color: '#212529', marginBottom: 16 },
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
