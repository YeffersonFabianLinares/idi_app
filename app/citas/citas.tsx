// @ts-ignore
// @ts-ignore
import logoImgDemanda from '@/assets/images/citas/demanda.png';
// @ts-ignore
import logoImgTorax from '@/assets/images/citas/torax.png';
import TitleApp from '@/components/TitleApp';
import { globalStyles } from '@/styles/style';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface MenuCitas {
    description: string
    logo: ImageSourcePropType
    link: routesAppoinments
    type?: string
}

type routesAppoinments = '/citas/FormAppoinment' | '/citas/formSpeciality/Page'

export default function SolicitaCita() {
    const router = useRouter();

    const opcionesCitas: MenuCitas[] = [
        {
            description: 'Para autogestionar citas Imágenes Diagnosticas, da clic sobre esta imagen.',
            logo: logoImgTorax,
            link: '/citas/FormAppoinment',
            type: 'diagnostica'
        },
        {
            description: 'Para autogestionar citas de Demanda Inducida, da clic sobre esta imagen.',
            logo: logoImgDemanda,
            link: '/citas/FormAppoinment',
            type: 'demanda'
        },
        // {
        //     description: 'Si requieres otra especialidad y/o vienes remitido de algún asegurador (EPS), da clic sobre esta imagen.',
        //     logo: logoImgDiagnostico,
        //     link: '/citas/formSpeciality/Page'
        // },
    ];

    const agendarCita = (link: routesAppoinments, type: string | undefined) => {
        router.push({
            pathname: link as any,
            params: { type: type }
        });
    }

    return (
        <View style={globalStyles.container}>
            <ScrollView contentContainerStyle={styles.container}>
                <TitleApp
                    title1='Solicita tu'
                    title2='cita'
                />

                <View style={styles.optionsGrid}>
                    {opcionesCitas.map((item, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInUp.delay(200 * index).springify()}>
                            <TouchableOpacity style={styles.card}
                                onPress={() => agendarCita(item.link, item.type)}>
                                <View style={styles.logoContainer}>
                                    <Image
                                        source={item.logo}
                                        style={styles.entidadLogo}
                                        resizeMode="contain"
                                    />
                                </View>
                                <Text style={styles.descriptionText}>{item.description}</Text>
                                <View style={styles.btnSimulado}>
                                    <Text style={styles.btnSimuladoText}>Agendar ahora</Text>
                                    <Ionicons name="chevron-forward" size={16} color="#00a6a6" />
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 25 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
    logoIdime: { fontSize: 35, fontWeight: 'bold', color: '#00a6a6' },

    titleSection: { marginBottom: 30 },
    title: { fontSize: 32, color: '#334155', lineHeight: 38 },
    orangeLine: { width: 50, height: 4, backgroundColor: '#ff9900', marginTop: 8 },

    optionsGrid: { gap: 20 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    logoContainer: { height: 60, width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    entidadLogo: { width: '80%', height: '100%' },
    entidadText: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
    descriptionText: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20, marginBottom: 15 },

    btnSimulado: { flexDirection: 'row', alignItems: 'center' },
    btnSimuladoText: { color: '#00a6a6', fontWeight: 'bold', fontSize: 14, marginRight: 5 },
});
