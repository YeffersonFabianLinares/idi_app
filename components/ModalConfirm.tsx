import { Modal, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "./Themed";

interface ConfirmModalProps {
    visible: boolean;
    // onClose: () => void;
    // onConfirm: () => void;
}

const ModalConfirm = ({ visible }: ConfirmModalProps) => {

    return (
        <>
            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.toastCard}>
                        <Text style={styles.text}>¿Deseas salir sin guardar?</Text>
                        <View style={styles.row}>
                            <TouchableOpacity>
                                <Text style={styles.btnNo}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.btnSi}>Sí, salir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default ModalConfirm

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro semitransparente
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    toastCard: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#FFFFFF', // Blanco
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10, // Sombra para Android
        overflow: 'hidden'
    },
    warningBar: {
        width: 60,
        height: 4,
        backgroundColor: '#ff9900', // Naranja
        borderRadius: 2,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    text: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnNo: {
        backgroundColor: '#f5f5f5', // Gris muy claro para contraste
    },
    btnSi: {
        backgroundColor: '#00A6A6', // Turquesa
    },
    btnTextNo: {
        color: '#666',
        fontWeight: '600',
        fontSize: 14,
    },
    btnTextSi: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});