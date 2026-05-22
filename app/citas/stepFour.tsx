import Button from '@/components/form/Button';
import { InputDate } from '@/components/form/InputDate';
import { Select } from '@/components/form/Select';
import { LoadingModal } from '@/components/LoadingModal';
import { useAsyncFormHandler } from '@/hook/useAsyncFormHandler';
import { getDependencesStepFour, searchAppoinmentDisponibily } from '@/services/appoinment.service';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
import Toast from 'react-native-toast-message';

interface StepFourProps {
    stepFields: string[]
    onFinish: () => void
}

interface IDependences {
    sedes: []
}

/**
 * Sub-componente: Paso 4 - Selección de Horario y Confirmación (Real-time).
 * 
 * Este componente permite al usuario buscar espacios disponibles en la agenda 
 * y recibir los resultados en tiempo real mediante una conexión de socket.
 * 
 * @module Screens/Appointments/Steps/StepFour
 */

/**
 * @param {string[]} stepFields - Campos a validar antes de disparar la búsqueda.
 * @param {() => void} onFinish - Función para confirmar la reserva final.
 */
const StepFour = ({ stepFields, onFinish }: StepFourProps) => {
    const [horarios, setHorarios] = useState<any[]>([])
    const { trigger, getValues, setValue, watch } = useFormContext()
    const [loading, setLoading] = useState<boolean>(false)
    const [dependences, setDependences] = useState<IDependences>()

    const busqueda = watch('busqueda')
    const acepta_id = watch('acepta_id')
    const scrollRef = useRef<ScrollView>(null);

    const { execute, isLoading } = useAsyncFormHandler()

    const optionsBusqueda = [
        { id: '1', label: 'Buscar la primera cita disponible' },
        { id: '2', label: 'Buscar por sede' },
        { id: '3', label: 'Buscar por fecha' },
        { id: '4', label: 'Buscar por sede y fecha' },
    ]

    const optionsJornada = [
        { label: 'Mañana (AM)', id: 'A' },
        { label: 'Tarde (PM)', id: 'P' },
        { label: 'Todas (T)', id: 'T' },
    ]

    const scrollToBottom = () => {
        scrollRef.current?.scrollToEnd({ animated: true });
    };

    useEffect(() => {
        const getDependencesFn = async () => {
            const response = await getDependencesStepFour({
                cod_depto: getValues('cod_depto'),
                cod_empresa: getValues('cod_empresa'),
                cod_examen: getValues('cod_examen'),
            })
            setDependences(response)
        }

        getDependencesFn()
    }, [])

    /**
     * Gestión de Seguridad y UX:
     * - Safety Timer: Implementa un timeout de 45s. Si el socket no responde en ese 
     *   tiempo, cancela el loading y notifica al usuario para evitar bloqueos infinitos.
     * - Display Condicional: Muestra los selectores de Sede o Fecha solo si el tipo 
     *   de búsqueda seleccionado lo requiere (basado en 'watch').
     */

    /**
     * Dispara la búsqueda de disponibilidad.
     * Envía los criterios seleccionados al servidor para que este inicie el proceso 
     * de consulta en las bases de datos de citas y emita la respuesta por el socket.
     */
    const onPress = async () => {
        try {
            const allValues = getValues();
            const fieldNames = [...stepFields, 'id_menbot', 'sede_dispo', 'hora_dispo'];

            const isValid = await trigger(fieldNames);

            if (isValid) {
                // Creamos un objeto nuevo solo con las llaves permitidas
                const data = Object.fromEntries(
                    Object.entries(allValues).filter(([key]) => fieldNames.includes(key))
                );
                setHorarios([])
                setValue('acepta_id', null)
                setLoading(true)
                const response = await execute(() => searchAppoinmentDisponibily(data))

                if (response.alertSeverity === 'success') {
                    const rawData = response.response?.data
                    const listadoCitas = Object.keys(rawData)
                        .filter(key => { return key.startsWith('fec_dispo_') && rawData[key] !== null; })
                        .map(key => {
                            const index = key.split('_').pop();
                            return {
                                id: index,
                                fecha: rawData[`fec_dispo_${index}`],
                                hora: rawData[`hor_dispo_${index}`],
                                sede: rawData[`sed_dispo_${index}`],
                                dir_sede: rawData[`sede${index}`]?.direccion1 ?? null
                            };
                        });
                    setHorarios(listadoCitas)

                    if (listadoCitas.length === 0) {
                        Toast.show({
                            type: 'error',
                            text1: 'Idime',
                            text2: rawData['mensaje']
                        })
                    }
                }
            }
        } catch (error) {
            console.error('Error interno');
        } finally {
            setLoading(false)
        }
    }

    const handleFinish = () => {
        // setLoading(true)
        
        onFinish()
    }

    /**
     * UI y Visualización de Citas:
     * - Listado de Horarios: Renderiza tarjetas interactivas (TouchableOpacity).
     * - Selección Visual: Utiliza un 'acepta_id' para marcar la tarjeta seleccionada 
     *   con un borde y un indicador naranja.
     */
    return (
        <Animated.View entering={FadeInRight}>
            <View style={styles.scrollContent}>
                {/* Card Informativo Superior */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Disponibilidad de Citas</Text>
                    <Text style={styles.infoSubtitle}>
                        Seleccione el horario que mejor se adapte a su disponibilidad en la clínica seleccionada.
                    </Text>
                </View>
                <LoadingModal visible={loading || isLoading} />
                <View>
                    <Select
                        label='Tipo de búsqueda'
                        name='busqueda'
                        options={optionsBusqueda}
                        placeholder='Seleccione'
                    />
                </View>
                <View>
                    <Select
                        label='Jornada'
                        name='hora_dispo'
                        options={optionsJornada}
                        placeholder='Seleccione'
                    />
                </View>
                {
                    (busqueda === '2' || busqueda === '4') &&
                    <View>
                        <Select
                            label='Sedes'
                            name='sede_dispo'
                            options={dependences?.sedes || []}
                            placeholder='Seleccione'
                        />
                    </View>
                }
                {
                    (busqueda === '3' || busqueda === '4') &&
                    <View>
                        <InputDate
                            label='Fecha cita'
                            name='fec_dispo'
                            value={new Date()}
                            minimumDate={new Date()}
                        />
                    </View>
                }
                <View
                    style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', marginBottom: 15 }}>
                    <Button
                        title='Buscar Cita'
                        onPress={onPress}
                    />
                </View>

                {/* Listado de Tarjetas de Horario */}
                {horarios.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.8}
                        onPress={() => setValue('acepta_id', item.id)}
                        style={[
                            styles.scheduleCard,
                            acepta_id === item.id && styles.selectedCard
                        ]}
                    >
                        {/* Indicador lateral naranja (solo si está seleccionado) */}
                        {acepta_id === item.id && <View style={styles.activeIndicator} />}

                        <View style={styles.cardContent}>
                            <View style={styles.rowBetween}>
                                {/* <View style={styles.dateTimeContainer}> */}
                                <View>
                                    <View style={styles.iconTextRow}>
                                        <Calendar color="#0A5A5A" size={16} />
                                        <Text style={styles.dateText}>{item.fecha}</Text>
                                    </View>
                                    <View style={[styles.iconTextRow, { marginTop: 5 }]}>
                                        <Clock color="#444" size={16} />
                                        <Text style={styles.timeText}>{item.hora}</Text>
                                    </View>
                                </View>

                                {/* Radio button visual */}
                                <View style={[styles.radioOuter, acepta_id === item.id && styles.radioOuterActive]}>
                                    {acepta_id === item.id && <View style={styles.radioInner} />}
                                </View>
                            </View>

                            <View style={styles.locationContainer}>
                                <Text style={styles.labelClinica}>SEDE</Text>
                                <Text style={styles.nameClinica}>{item.sede}</Text>
                                <View style={[styles.iconTextRow, { marginTop: 8 }]}>
                                    <MapPin color="#666" size={14} />
                                    <Text style={styles.addressText}>{item.dir_sede}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
                {
                    (acepta_id && horarios.length > 0) &&
                    <View>
                        <View
                            style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', marginBottom: 15 }}>
                            <Button
                                title='Confirmar Cita'
                                onPress={handleFinish}
                            />
                        </View>
                    </View>
                }
                {/* <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={scrollToBottom}
                    activeOpacity={0.8}
                >
                    <ChevronDown color="white" size={30} />
                </TouchableOpacity> */}
            </View>
        </Animated.View >
    );
};

const styles = StyleSheet.create({
    scrollContent: { },
    // Estilos Card Informativo
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 25,
        marginBottom: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    infoTitle: { color: '#0A5A5A', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    infoSubtitle: { color: '#666', lineHeight: 20, fontSize: 14 },

    // Estilos Título Sección
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },

    // Estilos Tarjeta Horario
    scheduleCard: {
        backgroundColor: '#EDF2F2',
        borderRadius: 20,
        marginBottom: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedCard: { backgroundColor: '#E1E9E9', borderColor: '#D1DBDB' },
    activeIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 6,
        backgroundColor: '#D97706', // Color ámbar del indicador
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4
    },
    cardContent: { padding: 20, paddingLeft: 25 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    iconTextRow: { flexDirection: 'row', alignItems: 'center' },
    dateText: { marginLeft: 8, color: '#0A5A5A', fontWeight: 'bold', fontSize: 16 },
    timeText: { marginLeft: 8, color: '#444', fontSize: 14 },

    // Estilos Radio Button
    radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#D1DBDB', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
    radioOuterActive: { borderColor: '#0A5A5A' },
    radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0A5A5A' },

    // Estilos Detalle Clínica
    locationContainer: { marginTop: 20 },
    labelClinica: { fontSize: 10, color: '#888', fontWeight: 'bold', letterSpacing: 1 },
    nameClinica: { fontSize: 15, fontWeight: 'bold', color: '#222', marginTop: 2 },
    addressText: { marginLeft: 5, color: '#666', fontSize: 12, flexShrink: 1 },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#2D7A78',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Sombra en Android
        shadowColor: '#000', // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default StepFour;
