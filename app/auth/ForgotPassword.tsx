import Button from "@/components/form/Button"
import { Input } from "@/components/form/Input"
import { InputDate } from "@/components/form/InputDate"
import { Select } from "@/components/form/Select"
import { LoadingModal } from "@/components/LoadingModal"
import TitleApp from "@/components/TitleApp"
import { useAsyncFormHandler } from "@/hook/useAsyncFormHandler"
import { IDependencesForgotPassword } from "@/interfaces/IDependencesForgotPassword"
import { ForgotPasswordType, forgotPasswordSchema } from "@/schemas/forgotPassword.schema"
import { forgotPassword, getDependences } from "@/services/forgotPassword.service"
import { globalStyles } from "@/styles/style"
import { zodResolver } from "@hookform/resolvers/zod"
import { useHeaderHeight } from "@react-navigation/elements"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Toast from "react-native-toast-message"

/**
 * Pantalla de Recuperación de Contraseña (Forgot Password).
 * 
 * Permite a los usuarios solicitar una nueva contraseña temporal enviada a su 
 * correo electrónico registrado, validando su identidad mediante datos básicos.
 * 
 * @module App/Auth/ForgotPassword
 */

/**
 * Componente funcional para el flujo de olvido de contraseña.
 * 
 * @requires React-Hook-Form - Gestión del estado y validación del formulario.
 * @requires Zod - Validación de esquema (forgotPasswordSchema).
 * @requires useAsyncFormHandler - Hook personalizado para manejar peticiones asíncronas y estados de carga.
 * @requires useHeaderHeight - Para el ajuste dinámico del teclado (KeyboardAvoidingView).
 */
const ForgotPassword = () => {
    const headerHeight = useHeaderHeight();
    /** 
     * Estado para almacenar las dependencias del formulario (Tipos de documento).
     * Se cargan desde el backend al montar el componente.
    */
    const [dependences, setDependences] = useState<IDependencesForgotPassword>()
    const methods = useForm<ForgotPasswordType>({
        resolver: zodResolver(forgotPasswordSchema)
    })

    /**
        * Hook personalizado para manejar el envío asíncrono.
        * @returns {execute} Función que envuelve la llamada a la API.
        * @returns {isLoading} Estado de carga para el LoadingModal.
    */
    const { execute, isLoading } = useAsyncFormHandler()

    /**
     * Procesa la solicitud de recuperación.
     * 
     * 1. Llama a la API de `forgotPassword` con los datos del formulario.
     * 2. Muestra un Toast con la severidad (success/error) y mensaje retornado por el backend.
     * 3. Si es exitoso, redirige al usuario al Login después de un breve retraso.
     * 
     * @param {ForgotPasswordType} data - Datos validados: tip_doc, num_doc, fec_nacido.
    */
    const onSubmit = async (data: ForgotPasswordType) => {
        const response = await execute(() => forgotPassword(data))
        Toast.show({
            type: response.alertSeverity,
            text1: 'Idime',
            text2: response.message,
            visibilityTime: 4000
        })

        if (response.alertSeverity === 'success') {
            setTimeout(() => {
                router.dismissAll()
                router.push({
                    pathname: '/auth/Login',
                    params: {type: 'Paciente'}
                })
            }, 1000);
        }
    }

    useEffect(() => {
        const getDependencesFn = async () => {
            const response = await getDependences()
            setDependences(response)
        }
        getDependencesFn()
    }, [])

    /**
     * UI:
     * - Utiliza FormProvider para inyectar los métodos de RHF en componentes hijos (Select, Input).
     * - Implementa TouchableWithoutFeedback para cerrar el teclado al tocar fuera.
     * - El botón activa la validación de Zod antes de ejecutar onSubmit.
    */
    return (
        <SafeAreaView style={globalStyles.container}>
            <FormProvider {...methods}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={headerHeight + 20}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
                            <LoadingModal visible={isLoading} />
                            <TitleApp
                                title1="Recupera tu"
                                title2="contraseña"
                            />
                            <View style={{ marginBottom: 30 }}>
                                <Text>
                                    Recupera tu contraseña por medio del correo electrónico registrado durante tu proceso de facturación
                                </Text>
                            </View>
                            <View>
                                <Select
                                    label="Tipo de documento"
                                    name="tip_doc"
                                    options={dependences?.types_documents || []}
                                />
                            </View>
                            <View>
                                <Input
                                    label="Número documento"
                                    name="num_doc" />
                            </View>
                            <View>
                                <InputDate
                                    label="Fecha nacimiento"
                                    name="fec_nacido"
                                    value={new Date()}
                                    maximumDate={new Date()}
                                />
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                                <Button title="Enviar" onPress={methods.handleSubmit(onSubmit)} />
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </FormProvider>
        </SafeAreaView>
    )
}

export default ForgotPassword