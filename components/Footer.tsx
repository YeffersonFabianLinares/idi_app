import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <View style={styles.container}>
            {/* Logo y Nombre */}
            <View style={styles.brandContainer}>
                <View style={styles.iconPlaceholder}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>+</Text>
                </View>
                <Text style={styles.brandName}>IDIME S.A.</Text>
            </View>

            {/* Copyright */}
            <Text style={styles.copyright}>
                © 2026 - {currentYear} IDIME S.A. Todos los derechos reservados.
            </Text>

            {/* Enlaces Legales */}
            <View style={styles.linksContainer}>
                <TouchableOpacity>
                    <Text style={styles.linkText}>Términos y Condiciones</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.linkText}>Política de Privacidad</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderColor: '#00000013',
        borderWidth: .5,
        paddingVertical: 20,
        alignItems: 'center',
        backgroundColor: '#f8f9fa', // Color de fondo claro
        width: '100%',
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconPlaceholder: {
        width: 24,
        height: 24,
        backgroundColor: '#2D7A78', // Color verde azulado del icono
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    brandName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D7A78',
    },
    copyright: {
        fontSize: 12,
        color: '#666',
        marginBottom: 15,
        textAlign: 'center',
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 300,
    },
    linkText: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
        textDecorationLine: 'none',
    },
});

export default Footer;
