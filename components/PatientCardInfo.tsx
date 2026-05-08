import { UserLoggedInfo } from "@/interfaces/UserLoggedInfo"
import { calcAge, formatNumber } from "@/utils/helpers"
import { router } from "expo-router"
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Logout from "./Logout"

const PatientCardInfo = () => {

    const [user, setUSer] = useState<UserLoggedInfo>()

    useEffect(() => {
        const getUserInfo = async () => {
            const result = await SecureStore.getItemAsync('user');

            if (result) {
                const userJson = JSON.parse(result) as UserLoggedInfo;
                setUSer(userJson)
            } else {
                router.dismissAll()
                router.push('/Home')
            }
        };
        getUserInfo()
    }, [])

    return (
        <View style={styles.patientCard}>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View>
                    <Text style={styles.label}>EXPEDIENTE DEL PACIENTE</Text>
                    <Text style={styles.patientName}>{user?.pri_nombre} {user?.pri_apellido}</Text>
                </View>
                <Logout />
            </View>
            <View style={styles.statsRow}>
                <View style={{ marginRight: 30 }}>
                    <Text style={styles.statLabel}>CÉDULA</Text>
                    <Text style={styles.statValue}>{formatNumber(user?.num_doc)}</Text>
                </View>
                <View>
                    <Text style={styles.statLabel}>EDAD</Text>
                    <Text style={styles.statValue}>{calcAge(user?.fec_nacido)} Años</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    label: { fontSize: 10, color: '#64748B', fontWeight: 'bold' },
    patientName: { fontSize: 23, fontWeight: 'bold', marginVertical: 10 },
    patientCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10
    },
    statsRow: { flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 15 },
    statLabel: { fontSize: 10, color: '#94A3B8' },
    statValue: { fontSize: 13, fontWeight: 'bold', color: '#334155' },
})

export default PatientCardInfo