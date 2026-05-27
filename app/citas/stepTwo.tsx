import Button from "@/components/form/Button";
import { Input } from "@/components/form/Input";
import { InputDate } from "@/components/form/InputDate";
import { RadioButton } from "@/components/form/RadioButton";
import { useAsyncFormHandler } from "@/hook/useAsyncFormHandler";
import { updateFieldsStepTwo } from "@/services/appoinment.service";
import { globalStyles } from "@/styles/style";
import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import Toast from "react-native-toast-message";

interface StepTwoProps {
    onNext: () => void;
    stepFields: string[]
    setLoading: Dispatch<SetStateAction<boolean>>
}

/**
 * Sub-componente: Paso 2 - Información Personal y Datos de Contacto.
 * 
 * Gestiona la captura detallada de los datos del paciente (nombres, apellidos, sexo, 
 * fecha de nacimiento y medios de contacto) y su respectiva actualización en el backend.
 * 
 * @module Screens/Appointments/Steps/StepTwo
 */

/**
 * @param {() => void} onNext - Función para avanzar al paso 3.
 * @param {string[]} stepFields - Campos que pertenecen a esta sección para validación y filtrado.
 * @param {Dispatch<SetStateAction<boolean>>} setLoading - Control del indicador de carga global.
 */
const StepTwo = ({ onNext, stepFields, setLoading }: StepTwoProps) => {

    /** Acceso al estado global del formulario. */
    const { getValues, trigger, setValue } = useFormContext()

    const optionsSex = [
        { label: 'Femenino', value: 'F' },
        { label: 'Masculino', value: 'M' },
    ];

    const optionAuth = [{
        label: "¿Autorizas y aceptas el tratamiento de datos por parte de nuestra organización?",
        value: "T"
    }]

    /**
        * Hook personalizado para manejar el envío asíncrono.
        * @returns {execute} Función que envuelve la llamada a la API.
        * @returns {isLoading} Estado de carga para el LoadingModal.
    */
    const { execute } = useAsyncFormHandler()

    /**
     * Actualiza la información personal en el servidor.
     * 
     * 1. Extrae solo los valores pertenecientes a este paso más el identificador 'id_menbot'.
     * 2. Envía la petición a 'updateFieldsStepTwo'.
     * 3. Si el servidor responde exitosamente (200), permite avanzar al siguiente paso.
     */
    const handlePress = async () => {
        const allValues = getValues();
        const fieldNames = [...stepFields, 'id_menbot'];

        const isValid = await trigger(fieldNames);

        if (isValid) {
            // Creamos un objeto nuevo solo con las llaves permitidas
            const data = Object.fromEntries(
                Object.entries(allValues).filter(([key]) => fieldNames.includes(key))
            );
            setLoading(true)
            const response = await execute(
                () => updateFieldsStepTwo(data)
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
     * UI y Accesibilidad:
     * - KeyboardType: El campo 'email' usa 'email-address' para mostrar el teclado optimizado en móvil.
     * - Opcionalidad: Algunos campos (segundo nombre/apellido, teléfono secundario) están marcados 
     *   como 'required={false}' para no bloquear el flujo.
     * - Animación: Entrada lateral suave mediante 'FadeInRight'.
     */
    return (
        <Animated.View entering={FadeInRight}>
            <View style={globalStyles.inputGroup}>
                <Input
                    label="Primer Nombre"
                    name="pri_nombre"
                    placeholder="Primer Nombre" />
            </View>
            <View style={globalStyles.inputGroup}>
                <Input
                    label="Segundo Nombre"
                    name="seg_nombre"
                    required={false}
                    placeholder="Segundo Nombre" />
            </View>
            <View style={globalStyles.inputGroup}>
                <Input
                    label="Primer Apellido"
                    name="pri_apellido"
                    placeholder="Primer Apellido" />
            </View>
            <View style={globalStyles.inputGroup}>
                <Input
                    label="Segundo Apellido"
                    name="seg_apellido"
                    required={false}
                    placeholder="Segundo Apellido" />
            </View>
            <View style={globalStyles.inputGroup}>
                <RadioButton
                    name="sexo"
                    label="Sexo"
                    options={optionsSex}
                />
            </View>
            <View style={globalStyles.inputGroup}>
                <InputDate
                    label="Fecha nacimiento"
                    name="fec_nacido"
                    maximumDate={new Date()}
                    value={new Date()} />
            </View>
            <View style={globalStyles.inputGroup}>
                <Input
                    label="Teléfono principal"
                    name="telefono_o"
                    placeholder="Teléfono principal"
                />
            </View>
            <View style={globalStyles.inputGroup}>
                <Input
                    label="Teléfono secundario"
                    name="telefono_c"
                    required={false}
                    placeholder="Teléfono secundario"
                />
            </View>
            <View style={globalStyles.inputGroup}>
                <Input
                    label="Email"
                    name="email"
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <View style={globalStyles.inputGroup}>
                <RadioButton
                    name="auth_data"
                    label=""
                    required={false}
                    options={optionAuth}
                />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                <Button title='Continuar' onPress={handlePress} />
            </View>
        </Animated.View>
    )
};

export default StepTwo;