import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

export const LoadingModal = ({ visible }: { visible: boolean }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2D7A78" />
        <Text style={styles.text}>Procesando, por favor espera...</Text>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Fondo oscurecido
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    gap: 15,
  },
  text: { color: '#333', fontWeight: '600' }
});
