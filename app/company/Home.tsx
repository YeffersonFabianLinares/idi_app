// @ts-ignore
import { MenuCompany } from '@/components/MenuCompany';
import MenuGeneral from '@/components/MenuGeneral';
import PatientCardInfo from '@/components/PatientCardInfo';
import { Menu } from '@/interfaces/Menu';
import { globalStyles } from '@/styles/style';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ServiciosPortal() {

    const options: Menu[] = MenuCompany

    return (
        <SafeAreaView style={globalStyles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
                <PatientCardInfo />
                <MenuGeneral options={options} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingBottom: 0 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingTop: 20
    },
    logoText: { fontSize: 45, fontWeight: 'bold', color: '#00a6a6' },
    closeBtn: { marginTop: -10 },
    imageContainer: {
        width: '100%',
        height: 220,
        backgroundColor: '#ddd',
        marginBottom: 20,
        overflow: 'hidden'
    },
    mainImage: { width: '100%', height: '100%' },
});
