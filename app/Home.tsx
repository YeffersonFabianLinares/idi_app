// @ts-ignore
import logoImgDiagnostico from '@/assets/images/main-header.webp';
import MenuGeneral from '@/components/MenuGeneral';
import { MenuMain } from '@/components/MenuMain';
import { Menu } from '@/interfaces/Menu';
import { globalStyles } from '@/styles/style';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
/**
 * Pantalla Principal (Dashboard).
 * 
 * Punto de entrada principal después del login. Presenta un acceso directo
 * a los servicios clave de la aplicación mediante un menú dinámico.
 * 
 * @module Screens/Home/Home
 */

/**
 * Componente funcional de la vista de inicio.
 * 
 * @requires MenuMain - Constante con la configuración de rutas, iconos y etiquetas del menú.
 * @requires MenuGeneral - Componente de UI que renderiza la lista de opciones de forma estandarizada.
 */
export const Home = () => {
    /** 
     * Colección de opciones del menú principal.
     * Define la estructura de navegación vertical.
     * @type {Menu[]}
    */
    const options: Menu[] = MenuMain

    /**
     * UI:
     * - ScrollView: Permite la navegación si el menú excede el alto de pantalla en dispositivos pequeños.
     * - Header Personalizado: Título con estilos diferenciados (Bold/Light).
     * - Brand Image: Contenedor de imagen principal con resizeMode cover para mantener la proporción.
     * - Abstracción: Delega la lógica de renderizado de los botones al componente especializado MenuGeneral.
     */
    return (
        <SafeAreaView style={globalStyles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scroll}>

                <Text style={styles.headerTitle}>Ingresa <Text style={{ fontWeight: '300' }}>a tu portal</Text></Text>

                <View style={styles.imageContainer}>
                    <Image
                        source={logoImgDiagnostico}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                </View>
                <View style={{
                    paddingHorizontal: 20
                }}>
                    <MenuGeneral options={options} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingBottom: 40 },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 25,
        marginTop: 30,
        marginBottom: 20
    },
    imageContainer: {
        width: '100%',
        height: 220,
        backgroundColor: '#ddd',
        marginBottom: 20,
        overflow: 'hidden'
    },
    mainImage: { width: '100%', height: '100%' },
});

export default Home