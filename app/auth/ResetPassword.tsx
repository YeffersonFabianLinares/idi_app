import Button from "@/components/form/Button";
import { Input } from "@/components/form/Input";
import { LoadingModal } from "@/components/LoadingModal";
import TitleApp from "@/components/TitleApp";
import { useAsyncFormHandler } from "@/hook/useAsyncFormHandler";
import { ResetPasswordSchema, resetPasswordSchema } from "@/schemas/resetPassword.schema";
import { resetPassword } from "@/services/forgotPassword.service";
import { globalStyles } from "@/styles/style";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from 'react-native-reanimated';
import Toast from "react-native-toast-message";

/**
 * Pantalla de Cambio Obligatorio o Restablecimiento de Contraseña.
 * 
 * Esta vista se utiliza cuando un usuario ingresa por primera vez (tras un olvido)
 * o cuando el sistema requiere una actualización de credenciales.
 * 
 * @module Screens/Auth/ResetPassword
 */

/**
 * Componente funcional para definir una nueva contraseña.
 * 
 * @requires Expo-Router - Para recuperar el parámetro 'ordinal' de la URL.
 * @requires React-Hook-Form - Para gestionar el emparejamiento de contraseñas.
 * @requires Zod - Valida que la nueva contraseña cumpla con criterios de seguridad (resetPasswordSchema).
 */
const ResetPassword = () => {

    /** 
     * Identificador único del usuario (ordinal) recuperado de los parámetros de búsqueda local.
     * Este valor se inyecta automáticamente como valor por defecto en el formulario.
    */
    const { ordinal } = useLocalSearchParams<{ ordinal: string }>();
    /** Estados locales para alternar la visibilidad de los campos de contraseña. */
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);

    /**
         * Hook personalizado para manejar el envío asíncrono.
         * @returns {execute} Función que envuelve la llamada a la API.
         * @returns {isLoading} Estado de carga para el LoadingModal.
     */
    const { execute, isLoading } = useAsyncFormHandler()

    const methods = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            ordinal: ordinal
        }
    })

    /**
     * Envía la nueva contraseña al servidor.
     * 
     * 1. Utiliza `execute` para procesar la petición vía `resetPassword`.
     * 2. Muestra un feedback visual mediante Toast.
     * 3. Limpia la pila de navegación y redirige al Login forzando el tipo 'Paciente'.
     * 
     * @param {ResetPasswordSchema} data - Objeto con password, confirmPassword y el ordinal del usuario.
    */
    const onSubmit = async (data: ResetPasswordSchema) => {
        const response = await execute(() => resetPassword(data))
        Toast.show({
            type: response.alertSeverity,
            text1: 'Idime',
            text2: response.message
        })
        router.dismissAll()
        router.push({
            pathname: '/auth/Login',
            params: { tipo: 'Paciente' }
        })

    }

    /**
     * UI:
     * - Utiliza Animated.View (Reanimated) para suavizar la entrada de los campos.
     * - Los inputs incluyen iconos interactivos (MaterialCommunityIcons) para la visualización del texto.
    */
    return (
        <View style={globalStyles.container}>
            <FormProvider {...methods}>
                <LoadingModal visible={isLoading} />
                <ScrollView contentContainerStyle={styles.container}>
                    <Animated.View entering={FadeIn.delay(500)} style={styles.instructivosContainer}>
                        <TitleApp
                            title1="Nueva"
                            title2="Contraseña" />
                        <View>
                            <Input
                                label="Nueva Contraseña"
                                name="password"
                                secureTextEntry={!showPassword}
                                rightIcon={
                                    <MaterialCommunityIcons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={24}
                                        color="grey"
                                        onPress={() => setShowPassword(!showPassword)}
                                    />
                                }
                            />
                        </View>
                        <View>
                            <Input
                                label="Confirmar Contraseña"
                                name="confirmPassword"
                                secureTextEntry={!showPasswordConfirm}
                                rightIcon={
                                    <MaterialCommunityIcons
                                        name={showPasswordConfirm ? 'eye-off' : 'eye'}
                                        size={24}
                                        color="grey"
                                        onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                    />
                                }
                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                            <Button title="Aceptar" onPress={methods.handleSubmit(onSubmit)} />
                        </View>
                    </Animated.View>
                </ScrollView>
            </FormProvider>
        </View>
    )
}

export default ResetPassword

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#f8fafc' },
    container: { padding: 30, paddingTop: 50, alignItems: 'center', justifyContent: 'center' },
    instructivosContainer: { alignSelf: 'flex-start', marginBottom: 25, width: '100%' },
})