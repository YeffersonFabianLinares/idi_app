import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Modal from 'react-native-modal';
import { View } from "./Themed";

interface ModalConfirmProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}
const ModalConfirm = ({
    isVisible,
    onClose,
    onConfirm,
    title,
    message
}: ModalConfirmProps) => {

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose} // Cierra si tocan fuera
            onBackButtonPress={onClose} // Para Android
            animationIn="zoomIn"
            animationOut="zoomOut"
            useNativeDriver
            hideModalContentWhileAnimating
        >
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>

                <Text style={styles.message}>{message}</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.button, styles.buttonCancel]}
                    >
                        <Text style={styles.textCancel}>Volver</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onConfirm}
                        style={[styles.button, styles.buttonConfirm]}
                    >
                        <Text style={styles.textConfirm}>Confirmar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8fafc',
        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 19,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 10,
    },
    message: {
        textAlign: 'center',
        color: '#64748b',
        lineHeight: 22,
        marginBottom: 25,
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        gap: 12,
    },
    button: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        justifyContent: 'center',
    },
    buttonCancel: {
        backgroundColor: '#e2e8f0',
    },
    buttonConfirm: {
        backgroundColor: '#ef4444', // Rojo para cancelar, cámbialo a tu verde si prefieres
    },
    textCancel: {
        textAlign: 'center',
        color: '#475569',
        fontWeight: '600',
    },
    textConfirm: {
        textAlign: 'center',
        color: 'white',
        fontWeight: '600',
    },
});

export default ModalConfirm