import { ChevronLeft } from 'lucide-react-native'; // Opcional para un look más intuitivo
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  step: number;
  totalSteps: number;
  titles: string[];
  onBack?: () => void; // Nueva función opcional
}

export const StepProgressBar = ({ step, totalSteps = 3, titles, onBack }: Props) => {
  const progressPercent = (step / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        {/* Si el paso es mayor a 1, permitimos regresar */}
        {step > 1 && onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft size={16} color="#006B6B" />
            <Text style={styles.stepTextActive}>
              PASO {step} DE {totalSteps}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.stepText}>
            PASO {step} DE {totalSteps}
          </Text>
        )}
        
        <Text style={styles.titleText}>{titles[step - 1]}</Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${progressPercent}%` } 
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2f2', // Un fondo suave para indicar que es clicable
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stepText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006B6B',
    letterSpacing: 0.5,
  },
  stepTextActive: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006B6B',
    marginLeft: 4,
  },
  titleText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 6,
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#006B6B',
    borderRadius: 10,
  },
});
