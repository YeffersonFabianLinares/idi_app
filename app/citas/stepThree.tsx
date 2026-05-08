import Button from "@/components/form/Button";
import { RadioButton } from "@/components/form/RadioButton";
import { Select } from "@/components/form/Select";
import Select2Paginado from "@/components/form/Select2Paginado";
import { useAsyncFormHandler } from "@/hook/useAsyncFormHandler";
import { IDependencesAppoinemnts } from "@/interfaces/IDependencesAppoinemnts";
import api from "@/plugins/axios";
import { updateFieldsStepThree } from "@/services/appoinment.service";
import { globalStyles } from "@/styles/style";
import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import Toast from "react-native-toast-message";


interface StepThreeProps {
    onNext: () => void;
    dependences: IDependencesAppoinemnts;
    stepFields: string[]
    type: string
    setLoading: Dispatch<SetStateAction<boolean>>
}

/**
 * Sub-componente: Paso 3 - Selección de Examen y Entidad.
 * 
 * Gestiona la localización de la cita y la búsqueda avanzada de exámenes 
 * filtrados por departamento, entidad (EPS/Empresa) y área médica.
 * 
 * @module Screens/Appointments/Steps/StepThree
 */

/**
 * @param {IDependencesAppoinemnts} dependences - Contiene la lista inicial de departamentos.
 * @param {() => void} onNext - Función para avanzar al paso 4 (Disponibilidad).
 * @param {string[]} stepFields - Campos a validar y persistir en este paso.
 * @param {string} type - Tipo de cita (LAB/IMG) para filtrar entidades.
 */

const stepThree = ({ dependences, onNext, stepFields, type, setLoading }: StepThreeProps) => {

    /** 
     * Suscripción a cambios en tiempo real del formulario.
     * Se utiliza 'watch' para disparar la aparición de los siguientes campos
     * conforme el usuario completa la información.
     */
    const { watch, getValues, trigger } = useFormContext();
    const busExam = watch('busExam')
    const cod_depto = watch('cod_depto')
    const cod_empresa = watch('cod_empresa')
    const cod_area = watch('cod_area')

    /**
        * Hook personalizado para manejar el envío asíncrono.
        * @returns {execute} Función que envuelve la llamada a la API.
        * @returns {isLoading} Estado de carga para el LoadingModal.
    */
    const { execute } = useAsyncFormHandler()

    const optionsExam = [
        { label: 'Código', value: 'C' },
        { label: 'Nombre', value: 'N' }
    ]

    /**
     * Procesa y persiste la selección del examen.
     * Envía la data filtrada al endpoint 'updateFieldsStepThree' antes de continuar.
     */
    const handlePress = async () => {
        const allValues = getValues();
        const fieldNames = [...stepFields, 'id_menbot'];
        const isValid = await trigger(fieldNames);
        if (isValid) {
            const data = Object.fromEntries(
                Object.entries(allValues).filter(([key]) => fieldNames.includes(key))
            );
            setLoading(true)
            const response = await execute(
                () => updateFieldsStepThree(data)
            )
            if (response.alertSeverity === 'success') {
                onNext()
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
     * Lógica de Cascada (UI):
     * 1. Departamento: Habilita la búsqueda de Entidades.
     * 2. Entidad: Habilita la opción de método de búsqueda de examen (Código/Nombre).
     * 3. Método de Búsqueda: Habilita el buscador paginado de exámenes.
     * 
     * @requires Select2Paginado - Componente de búsqueda con scroll infinito y debounce.
     */
    return (
        <Animated.View entering={FadeInRight}>
            <View>
                <Select
                    label="Seleccione el departamento dónde tomará el examen"
                    name="cod_depto"
                    placeholder="Departamento"
                    options={dependences.departments}
                />
            </View>
            {cod_depto &&
                <View>
                    <Select2Paginado
                        label="Entidad"
                        name="cod_empresa"
                        endpoint={`${api.defaults.baseURL}/entities`}
                        placeholder="Entidad"
                        autoCorrect={false}
                        extraParams={{ cod_depto: cod_depto, type: type }}
                    />
                </View>
            }
            {
                cod_empresa &&
                <View>
                    <RadioButton
                        label="Buscar examen por"
                        name="busExam"
                        options={optionsExam}
                    />
                </View>
            }
            {
                busExam && (
                    <View style={globalStyles.inputGroup}>
                        <View style={globalStyles.inputGroup}>
                            <Select2Paginado
                                label={`Escriba el ${busExam === 'C' ? 'código' : 'Nombre'} del examen a tomar`}
                                name="cod_examen"
                                endpoint={`${api.defaults.baseURL}/exams`}
                                autoCorrect={false}
                                extraParams={{ cod_empresa: cod_empresa, busExam: busExam, cod_area: cod_area }}
                            />
                        </View>
                    </View>)
            }
            <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                <Button title='Continuar' onPress={handlePress} />
            </View>
        </Animated.View>
    )
}

export default stepThree;