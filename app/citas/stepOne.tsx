import Button from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { Select } from '@/components/form/Select';
import { useAsyncFormHandler } from '@/hook/useAsyncFormHandler';
import { IDependencesAppoinemnts } from '@/interfaces/IDependencesAppoinemnts';
import { initAppoinment } from '@/services/appoinment.service';
import { globalStyles } from '@/styles/style';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

interface StepOneProps {
    dependences: IDependencesAppoinemnts;
    stepFields: string[]
    onNext: () => void;
    setLoading: Dispatch<SetStateAction<boolean>>
}

/**
 * Sub-componente: Paso 1 - Información Inicial y Validación de Identidad.
 * 
 * Se encarga de capturar el servicio de interés y los datos básicos del paciente
 * para realizar la apertura del registro (initAppoinment) en el backend.
 * 
 * @module Screens/Appointments/Steps/StepOne
 */

/**
 * @param {IDependencesAppoinemnts} dependences - Listas de áreas y documentos cargadas en el padre.
 * @param {string[]} stepFields - Lista de nombres de campos a validar en este paso.
 * @param {() => void} onNext - Función para avanzar al siguiente paso del Wizard.
 * @param {Dispatch<SetStateAction<boolean>>} setLoading - Control del estado de carga global.
 */
const StepOne = ({ dependences, setLoading, onNext, stepFields }: StepOneProps) => {

    /** 
     * Acceso al contexto del formulario compartido (FormProvider).
     * Permite leer y setear valores de forma global en el Wizard.
     */
    const { getValues, setValue, reset, trigger } = useFormContext()
    const { execute } = useAsyncFormHandler()

    /**
     * Procesa el inicio de la cita.
     * 
     * 1. Filtra los valores actuales para enviar solo los necesarios al endpoint 'initAppoinment'.
     * 2. Si el servidor retorna datos (paciente existente), mapea y actualiza los campos del 
     *    formulario automáticamente (setValue).
     * 3. Realiza un parseo especial para 'fec_nacido' convirtiendo el string del backend 
     *    en un objeto Date válido para el DatePicker de React Native.
     * 4. Al finalizar, invoca 'onNext' para avanzar al Paso 2.
     */
    const handlePress = async () => {
        const allValues = getValues();
        const fieldNames = [...stepFields, 'id_menbot'];

        const isValid = await trigger(stepFields);

        if (isValid) {
            // Creamos un objeto nuevo solo con las llaves permitidas
            const data = Object.fromEntries(
                Object.entries(allValues).filter(([key]) => fieldNames.includes(key))
            );
            setLoading(true)
            const response = await execute(
                () => initAppoinment(data)
            )
            if (response.alertSeverity === 'success') {
                if (response?.response?.data) {
                    // @ts-ignore
                    const dataResponse = response.response.data?.data
                    Object.keys(dataResponse).forEach((key) => {
                        // @ts-ignore
                        let value = dataResponse[key];

                        if (key === 'fec_nacido' && typeof value === 'string') {
                            value = new Date(value.replace(' ', 'T')); // El 'T' es para asegurar compatibilidad ISO
                        }

                        setValue(key, value, { shouldValidate: true });
                    });
                    onNext()
                }
            } else {
                Toast.show({
                    type: response.alertSeverity,
                    text1: 'Idime',
                    text2: response.message
                })
            }
            setLoading(false)
        }
    }

    /**
     * Limpieza inicial.
     * Ejecuta 'reset()' al montar el componente para asegurar que el formulario 
     * comience vacío en cada nueva intención de cita.
     */
    useEffect(() => {
        reset()
    }, [])

    /**
     * UI:
     * - Animación: Utiliza 'FadeInRight' de Reanimated para una transición lateral fluida.
     * - Componentes: Emplea 'Select' e 'Input' personalizados que se conectan automáticamente 
     *   al contexto mediante la propiedad 'name'.
     */
    return (
        <Animated.View entering={FadeInRight}>
            <View>
                <Select
                    label='¿En qué servicio está interesado?'
                    name='cod_area'
                    placeholder='Servicio'
                    options={dependences.areas || []} />
            </View>
            <View>
                <Select
                    label='Tipo de documento'
                    name='tip_doc'
                    placeholder='Tipo de documento'
                    options={dependences.types_documents || []}
                />
            </View>
            <View style={globalStyles.inputGroup}>
                <Input
                    label='Número de documento de identidad'
                    name='num_doc'
                    placeholder='Ej. 123456789'
                />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                <Button title='Continuar' onPress={handlePress} />
            </View>
        </Animated.View>
    );
};

export default StepOne;
