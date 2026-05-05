import { useAsyncFormHandler } from "@/hook/useAsyncFormHandler"
import { logout } from "@/services/auth.service"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { StyleSheet, TouchableOpacity } from "react-native"
import Toast from "react-native-toast-message"
import { LoadingModal } from "./LoadingModal"

const Logout = () => {

    /**
     * Hook personalizado para manejar el envío asíncrono.
     * @returns {execute} Función que envuelve la llamada a la API.
     * @returns {isLoading} Estado de carga para el LoadingModal.
    */
    const { execute, isLoading } = useAsyncFormHandler()

    const logoutFn = async () => {
        const response = await execute(
            () => logout()
        )
        if (response.alertSeverity === 'success') {
            Toast.show({
                type: 'success',
                text1: 'Idime',
                text2: response.message,
                visibilityTime: 1000
            })
            setTimeout(() => {
                router.dismissAll()
                router.replace('/Home')
            }, 1000);
        }
    }


    return (
        <TouchableOpacity style={styles.closeBtn} onPress={logoutFn}>
            <LoadingModal visible={isLoading} />
            <Ionicons name="log-out-outline" size={35} color="#ff9900" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    closeBtn: { marginTop: -10 },
})

export default Logout
