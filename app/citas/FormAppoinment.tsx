import Button from '@/components/form/Button';
import { RadioButton } from '@/components/form/RadioButton';
import { LoadingModal } from '@/components/LoadingModal';
import ModalConfirm from '@/components/ModalConfirm';
import { StepProgressBar } from '@/components/StepProgressBar';
import { useAsyncFormHandler } from '@/hook/useAsyncFormHandler';
import { IDependencesAppoinemnts } from '@/interfaces/IDependencesAppoinemnts';
import { appoinmentSchema, IAppoinment } from '@/schemas/appoinment.schema';
import { appoinmentPrepareReserved, dependencesAppoinments } from '@/services/appoinment.service';
import { globalStyles } from '@/styles/style';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHeaderHeight } from '@react-navigation/elements';
import { useFocusEffect } from '@react-navigation/native';
import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import StepFour from './stepFour';
import StepOne from './stepOne';
import StepThree from './stepThree';
import StepTwo from './stepTwo';

/**
 * Pantalla Principal de Agendamiento (Wizard de 4 pasos).
 * 
 * Gestiona el flujo secuencial de creación de citas médicas, integrando validación 
 * por pasos, carga de dependencias dinámicas y protección de navegación nativa.
 * 
 * @module Screens/Appointments/FormAppoinment
 */

/**
 * Componente funcional de agendamiento.
 * 
 * @requires React-Hook-Form - Gestión centralizada del formulario.
 * @requires Zod - Validación mediante esquema 'appoinmentSchema'.
 * @requires React-Navigation - Manejo de listeners 'beforeRemove' y configuración de Stack.
 */
const FormAppoinment = () => {
    /** 
     * Control del flujo del Wizard.
     * @state currentStep {number} - Paso actual del 1 al 4.
     */
    const [currentStep, setCurrentStep] = useState(1);
    const [dependences, setDependences] = useState<IDependencesAppoinemnts>({ areas: [], types_documents: [], departments: [] });
    const [loading, setLoading] = useState<boolean>(false)
    const navigation = useNavigation();
    const [isSaved, SetIsSaved] = useState<boolean>(false)
    const headerHeight = useHeaderHeight();
    const [pendingAction, setPendingAction] = useState<any>(null);
    const [isModalFinishVisible, setIsModalFinishVisible] = useState(false);
    const [isVisible, setModalVisible] = useState(false);

    /** 
     * Mapeo de campos por paso para validación parcial.
     * Permite ejecutar 'methods.trigger()' solo en los campos visibles del paso actual.
     */
    const fieldsByStep: Record<number, string[]> = {
        1: ["cod_area", "tip_doc", "num_doc"],
        2: ["pri_nombre", "seg_nombre", "pri_apellido", "seg_apellido", "sexo", "fec_nacido", "telefono_o", "telefono_c", "email"],
        3: ["cod_depto", "cod_empresa", "busExam", "cod_examen"],
        4: ["busqueda", "hora_dispo", "fec_dispo"]
    };

    /** Parametro recibido por URL */
    const { type } = useLocalSearchParams<{ type: string }>();

    const methods = useForm<IAppoinment>({
        resolver: zodResolver(appoinmentSchema),
        defaultValues: {
            id_menbot: null
        },
        mode: "onChange",
    })


    const post_mortem = methods.watch('post_mortem')

    const optionsPostFinish = [
        {
            label: 'Agendar otra cita de la misma especialidad para este usuario',
            value: '1'
        }, {
            label: 'Agendar una cita para otra especialidad',
            value: '2'
        }, {
            label: 'Salir',
            value: '3'
        }
    ]

    /**
     * Hook personalizado para manejar el envío asíncrono.
     * @returns {execute} Función que envuelve la llamada a la API.
     * @returns {isLoading} Estado de carga para el LoadingModal.
    */
    const { execute, isLoading } = useAsyncFormHandler()

    /**
     * Retrocede al anterior paso excepto cuando esté en la pantalla del paso 1.
     */
    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    /**
     * Avanza al siguiente paso tras validar los campos específicos.
     * Utiliza 'methods.trigger' para asegurar que el paso actual cumpla con el esquema Zod.
     */
    const handleNext = async () => {
        // @ts-ignore
        const isValid = await methods.trigger(fieldsByStep[currentStep]);

        if (isValid && currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    }

    const onSubmit = async (data: IAppoinment) => {
        setLoading(false)

        const response = await execute(() => appoinmentPrepareReserved(data))
        Toast.show({
            type: response.alertSeverity,
            text1: 'Idime',
            text2: response.message
        })

        if (response.alertSeverity === 'success') {
            SetIsSaved(true)
            setIsModalFinishVisible(true)
        }
    }

    const onSubmitPostMortem = () => {
        setIsModalFinishVisible(false)
        switch (post_mortem) {
            case '1': // Agendar cita para mismo paciente y especialidad
                const allValues = methods.getValues();
                const fieldNames = [...fieldsByStep[1], ...fieldsByStep[2]]
                const data = Object.fromEntries(
                    Object.entries(allValues).filter(([key]) => fieldNames.includes(key))
                );
                methods.reset(data)
                setCurrentStep(1)
                SetIsSaved(false)
                break;

            case '2': // Agendar cita para otra especialidad
                methods.reset()
                setCurrentStep(1)
                SetIsSaved(false)
                break;

            case '3': // El caso de Salir
                SetIsSaved(true)
                router.replace('/Home');
                break;

            default: // default
                Toast.show({
                    type: 'error',
                    text1: 'Idime',
                    text2: 'Ninguna opción coincide'
                })
                break;
        }
    }

    const handleConfirmExit = () => {
        setModalVisible(false);
        if (pendingAction) {
            navigation.dispatch(pendingAction);
        }
    };

    useEffect(() => {
        const dependencesAppoinmentsFn = async () => {
            try {
                setLoading(true)
                const response = await execute(() => dependencesAppoinments(type))
                if(response.alertSeverity === 'success')
                    setDependences(response.response?.data);
                else {
                    Toast.show({
                        type: 'error',
                        text1: 'Idime',
                        text2: response.message
                    })
                }
            } catch (error) {
                console.error('error ==> ', error);
            } finally {
                setLoading(false)
            }
        }
        dependencesAppoinmentsFn();
    }, []);

    /**
     * Gestión de Navegación Segura (iOS/Android).
     * 
     * Implementa un listener 'beforeRemove' que intercepta intentos de salida.
     * - Si 'isSaved' es true: Permite la salida sin preguntar.
     * - Si hay cambios pendientes: Dispara una 'Alert.alert' de confirmación.
     */
    useFocusEffect(
        useCallback(() => {
            const onBeforeRemove = (e: any) => {
                // Si ya sabemos que puede salir (ej. guardó cambios), no hacemos preventDefault
                if (isSaved) return;

                e.preventDefault();
                setPendingAction(e.data.action);
                setModalVisible(true);
                setIsModalFinishVisible(false)
            };

            // Escuchar el evento de navegación
            const unsubscribe = navigation.addListener('beforeRemove', onBeforeRemove);

            return () => unsubscribe();
        }, [navigation, isSaved])
    );

    /**
     * UI y Configuración Nativa:
     * - iOS: Deshabilita 'gestureEnabled' dinámicamente para prevenir el cierre accidental por "swipe back".
     * - FormProvider: Envoltorio para permitir que StepOne, StepTwo, etc., accedan al contexto del formulario.
     * - Display Control: Utiliza 'display: none' para persistir el estado de los componentes ocultos sin desmontarlos.
     */
    return (
        <SafeAreaView style={globalStyles.container} edges={['bottom']}>
            {
                Platform.OS === 'ios' &&
                <Stack.Screen options={{
                    gestureEnabled: false
                }} />
            }
            <FormProvider {...methods}>
                <LoadingModal visible={isLoading} />
                <ModalConfirm
                    isVisible={isVisible}
                    onClose={() => setModalVisible(false)}
                    onConfirm={() => handleConfirmExit()}
                    title='Confirmación'
                    message='¿Estás seguro de que quieres salir?' />
                {/* <Button title='1' onPress={() => setIsModalFinishVisible(true)}></Button> */}
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={headerHeight + 20}>
                    <LoadingModal visible={loading} />
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
                            keyboardDismissMode='on-drag'
                            keyboardShouldPersistTaps="handled">
                            <StepProgressBar
                                step={currentStep}
                                totalSteps={4}
                                titles={["Información de la Cita", "Información Personal", "Información del Examen", "Confirmación"]}
                                onBack={handleBack}
                            />
                            <Modal
                                isVisible={isModalFinishVisible}
                                animationIn="zoomIn"
                                animationOut="zoomOut"
                                useNativeDriver
                                hideModalContentWhileAnimating>
                                <View style={styles.container}>
                                    <View style={styles.buttonContainer}>
                                        <RadioButton
                                            label='Tu cita fue agendada exitosamente, a tu celular llegará la confirmación y a tu correo electrónico fue enviada la 
                                                preparación y requisitos correspondientes.'
                                            name='post_mortem'
                                            direction='column'
                                            justifyContent='flex-start'
                                            options={optionsPostFinish}
                                        />
                                    </View>
                                    {post_mortem &&
                                        <View style={{
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Button title='Confirmar' onPress={onSubmitPostMortem}></Button>
                                        </View>
                                    }
                                </View>
                            </Modal>
                            <View style={currentStep === 1 ? { display: 'contents' } : { display: 'none' }}>
                                <StepOne dependences={dependences} onNext={handleNext} stepFields={fieldsByStep[1]} setLoading={setLoading} />
                            </View>
                            <View style={currentStep === 2 ? { display: 'contents' } : { display: 'none' }}>
                                <StepTwo onNext={handleNext} stepFields={fieldsByStep[2]} setLoading={setLoading} />
                            </View>
                            <View style={currentStep === 3 ? { display: 'contents' } : { display: 'none' }}>
                                <StepThree dependences={dependences} stepFields={fieldsByStep[3]} onNext={handleNext} type={type}
                                    setLoading={setLoading} />
                            </View>
                            {
                                currentStep === 4 &&
                                <View>
                                    <StepFour onFinish={methods.handleSubmit(onSubmit)} stepFields={fieldsByStep[4]} />
                                </View>
                            }
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </FormProvider>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8fafc',
        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        gap: 12,
    },
});

export default FormAppoinment;
