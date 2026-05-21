import Button from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { RadioButton } from '@/components/form/RadioButton';
import { LoadingModal } from '@/components/LoadingModal';
import TitleApp from '@/components/TitleApp';
import { useAsyncFormHandler } from '@/hook/useAsyncFormHandler';
import { UserLoggedInfo } from '@/interfaces/UserLoggedInfo';
import { authSchema, AuthSchema } from '@/schemas/auth.schema';
import { login } from '@/services/auth.service';
import { globalStyles } from '@/styles/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHeaderHeight } from '@react-navigation/elements';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

/**
 * Pantalla de Autenticación de Pacientes.
 * 
 * Gestiona el acceso al sistema, validación de credenciales y el flujo de 
 * recuperación de contraseña obligatoria (primer ingreso).
 * 
 * @module App/Auth/Login
 */

/**
 * Componente funcional de inicio de sesión.
 * 
 * @requires React-Hook-Form - Para la gestión del estado del formulario.
 * @requires Zod - Para la validación de esquemas (authSchema).
 * @requires Expo-SecureStore - Para la persistencia segura del token en dispositivos móviles.
 * @requires React-Native-Reanimated - Para las animaciones de entrada (FadeIn, FadeInUp).
 */
export default function LoginScreen() {
    /** 
     * Indica el tipo de acceso (recibido por parámetros de ruta).
    */
    const { type } = useLocalSearchParams<{ type: string }>();
    /** Estados locales para alternar la visibilidad de los campos de contraseña. */
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const headerHeight = useHeaderHeight();

    const methods = useForm<AuthSchema>({
        resolver: zodResolver(authSchema)
    })

    /**
     * Hook personalizado para manejar el envío asíncrono.
     * @returns {execute} Función que envuelve la llamada a la API.
     * @returns {isLoading} Estado de carga para el LoadingModal.
    */
    const { execute, isLoading } = useAsyncFormHandler();

    /**
     * Procesa la autenticación del usuario.
     * 
     * 1. Ejecuta la función de login con los datos validados.
     * 2. Si `forgot_password` es true, redirige a ResetPassword (cambio obligatorio).
     * 3. Si el login es exitoso, persiste el token en SecureStore (Móvil) o LocalStorage (Web).
     * 4. En caso de error, muestra un Toast informativo.
     * 
     * @param {AuthSchema} data - Datos del formulario validados por Zod.
    */
    const onSubmit = async (data: AuthSchema) => {
        const response = await execute(
            () => login(data)
        )

        if (response.alertSeverity === 'success') {
            if (response.response?.user?.forgot_password == true) {
                router.push({
                    pathname: '/auth/ResetPassword',
                    params: { ordinal: response.response?.user.ordinal }
                })
            } else {
                const token = response.response.token;
                if (Platform.OS === 'web') {
                    localStorage.setItem('userToken', token)
                } else {
                    await SecureStore.setItemAsync('userToken', token);
                    const user = response.response?.user
                    const userLoggedInfo: UserLoggedInfo = {
                        id: user.ordinal,
                        fec_nacido: user.fec_nacido,
                        num_doc: user.num_doc,
                        pri_nombre: user.pri_nombre,
                        pri_apellido: user.pri_apellido
                    }
                    await SecureStore.setItemAsync('user', JSON.stringify(userLoggedInfo))
                }
                router.dismissAll()
                router.replace('/company/Home')
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Idime',
                text2: 'Credenciales incorrectas'
            })
        }
    }

    /**
     * Redirige al flujo de recuperación de contraseña olvidada.
    */
    const goForgotPassword = () => {
        router.push('/auth/ForgotPassword')
    }

    useEffect(() => {
        methods.setValue('type', type)
    }, [])

    /*
    * Renderiza un formulario reactivo dentro de un KeyboardAvoidingView
    * para evitar que el teclado oculte los inputs en iOS/Android.
    */
    return (
        <View style={globalStyles.container}>
            <FormProvider {...methods}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={headerHeight + 20}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView contentContainerStyle={styles.container}>
                            <LoadingModal visible={isLoading} />
                            <Animated.View entering={FadeIn.delay(500)} style={styles.instructivosContainer}>
                                <TitleApp
                                    title1='Resultados'
                                    title2='IDIME' />
                                {/* <TouchableOpacity style={styles.linkRow}>
                            <Ionicons name="cloud-download-outline" size={24} color="#334155" />
                            <Text style={styles.linkText}>Instructivo de PayU</Text>
                        </TouchableOpacity> */}

                                {/* <TouchableOpacity style={styles.linkRow}>
                            <Ionicons name="cloud-download-outline" size={24} color="#334155" />
                            <Text style={styles.linkText}>Instructivo de descarga</Text>
                        </TouchableOpacity> */}
                            </Animated.View>
                            {/* Card con animación hacia arriba */}
                            <Animated.View entering={FadeInUp.springify()} style={styles.card}>
                                <View style={styles.orangeBar} />

                                <Text style={styles.cardTitle}>
                                    <Text style={{ fontWeight: 'bold' }}>Ingreso</Text> de Paciente
                                </Text>

                                <View>
                                    <Input
                                        label='Usuario'
                                        name='login'
                                        placeholder="10xxxxxx"
                                        autoCapitalize='none'
                                    />
                                </View>

                                <View>
                                    <Input
                                        label='Contraseña'
                                        name='clave'
                                        placeholder="**********"
                                        autoCapitalize='none'
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

                                <RadioButton
                                    label=''
                                    name='agree'
                                    required={false}
                                    options={[
                                        { label: '¿Autorizas y aceptas el tratamiento de datos por parte de nuestra organización?', value: '1' }
                                    ]}
                                />

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}>
                                    <Button
                                        title='Ingresar'
                                        onPress={methods.handleSubmit(onSubmit)}
                                    />
                                </View>
                                <TouchableOpacity style={{ marginTop: 20 }} onPress={goForgotPassword}>
                                    <Text style={styles.forgot}>¿Has olvidado tu contraseña?</Text>
                                </TouchableOpacity>
                            </Animated.View>

                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </FormProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 30, paddingTop: 10, alignItems: 'center', justifyContent: 'center' },
    logo: { fontSize: 70, fontWeight: 'bold', color: '#00a6a6', marginBottom: 30 },
    card: {
        width: '100%', maxWidth: 400, backgroundColor: '#fff',
        borderRadius: 12, padding: 25, shadowColor: '#000',
        shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
        borderTopWidth: 5, borderTopColor: '#ff9900', position: 'relative'
    },
    instructivosContainer: { alignSelf: 'flex-start', marginBottom: 25, width: '100%' },
    linkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    linkText: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginLeft: 10 },
    orangeBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 5, backgroundColor: '#ff9900' },
    checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, marginTop: 10 },
    circleCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#ff9900', marginRight: 12 },
    circleCheckActive: { backgroundColor: '#ff9900' },
    checkText: { flex: 1, fontSize: 13, color: '#475569', lineHeight: 18 },
    cardTitle: { fontSize: 20, color: '#334155', marginBottom: 25 },
    field: { marginBottom: 20 },
    forgot: { fontSize: 14, color: '#475569', textDecorationLine: 'underline' }
});
