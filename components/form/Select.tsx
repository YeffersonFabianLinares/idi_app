import { ChevronDown, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface Props {
    name: string;
    label: string;
    options: Option[]
    placeholder?: string;
    required?: boolean
    showEmptyOption?: boolean
}

interface Option {
    id: string | number;
    label: string;
}
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export const Select = ({ name, label, options, placeholder, required = true, showEmptyOption = true }: Props) => {
    const { control, formState: { errors } } = useFormContext();
    const [isVisible, setIsVisible] = useState(false);
    const error = errors[name];

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>
                {label} {required && <Text style={{ color: 'red' }}>*</Text>}
            </Text>

            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <>
                        <TouchableOpacity
                            style={[styles.trigger, error && { borderColor: 'red' }]}
                            onPress={() => setIsVisible(true)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.text, !value && styles.placeholder]}>
                                {value ? options.find(opt => opt.id === (value.id || value))?.label : placeholder}
                            </Text>
                            <ChevronDown size={20} color="#64748B" />
                        </TouchableOpacity>

                        <Modal
                            visible={isVisible}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setIsVisible(false)}
                        >
                            <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
                                <View style={styles.modalOverlay}>
                                    <TouchableWithoutFeedback>
                                        <View style={styles.sheet}>
                                            <View style={styles.header}>
                                                <Text style={styles.headerTitle}>{label}</Text>
                                                <TouchableOpacity onPress={() => setIsVisible(false)}>
                                                    <X size={24} color="#64748B" />
                                                </TouchableOpacity>
                                            </View>

                                            <FlatList
                                                data={showEmptyOption ? [{ id: 'empty', label: '-- Seleccione --' }, ...options] : options}
                                                keyExtractor={(item) => item.id.toString()}
                                                renderItem={({ item }) => {
                                                    const isEmpty = item.id === 'empty';
                                                    const isSelected = value === item.id || value?.id === item.id;

                                                    return (
                                                        <TouchableOpacity
                                                            style={[styles.option, isSelected && styles.optionActive]}
                                                            onPress={() => {
                                                                onChange(isEmpty ? null : item.id);
                                                                setIsVisible(false);
                                                            }}
                                                        >
                                                            <Text style={[
                                                                styles.optionText,
                                                                isEmpty && { color: '#94a3b8', fontStyle: 'italic' },
                                                                isSelected && styles.optionTextActive
                                                            ]}>
                                                                {item.label}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                }}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    </>
                )}
            />
            {error && <Text style={styles.errorText}>{error.message?.toString()}</Text>}
        </View>
    );
};



const styles = StyleSheet.create({
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 8, marginLeft: 4 },
    trigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    text: { fontSize: 16, color: '#1E293B' },
    placeholder: { color: '#94A3B8' },
    // Estilos del Bottom Sheet
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#FFF',
        height: SCREEN_HEIGHT * 0.7, // El 65% de la pantalla
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
    option: {
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    optionActive: { backgroundColor: '#F0F9F9' },
    optionText: { fontSize: 16, color: '#475569' },
    optionTextActive: { color: '#2D7A78', fontWeight: 'bold' },
    errorText: { color: 'red', fontSize: 12, marginTop: 4, marginLeft: 4 }
});
