import { globalStyles } from "@/styles/style";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const NoResult = () => {

    const abrirWeb = () => {
        Linking.openURL('https://idime.com.co/');
    };

    return (
        <Animated.View entering={FadeIn.duration(800)} style={globalStyles.container}>
            <MaterialCommunityIcons name="file-search-outline" size={100} color="#cbd5e1" />

            <View style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.dot} />
                    <Text style={styles.text}>Nuestro sistema no registra ningún resultado para ti.</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.dot} />
                    <Text style={styles.text}>
                        Si consideras que hay un error, te invitamos a ponerte en contacto con la sede más cercana.
                    </Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.dot} />
                    <TouchableOpacity onPress={abrirWeb}>
                        <Text style={styles.text}>
                            Consulta nuestros teléfonos y sedes en
                            <Text style={styles.link}> www.idime.com.co</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, elevation: 3 },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff9900', // El naranja de tu tabla original
        marginTop: 6,
        marginRight: 12
    },
    text: {
        flex: 1,
        fontSize: 15,
        color: '#475569',
        lineHeight: 22
    },
    link: {
        color: '#00a6a6',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    }
});

export default NoResult