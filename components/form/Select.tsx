import { globalStyles } from '@/styles/style';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ErrorMessage from '../ErrorMessage';

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

export const Select = ({ name, label, options, placeholder, required = true, showEmptyOption = true }: Props) => {
    const { control, formState: { errors } } = useFormContext();
    const [isOpen, setIsOpen] = useState(false);
    const error = errors[name];

    return (
        <View style={[globalStyles.inputGroup, { zIndex: isOpen ? 1000 : 1 }]}>
            <Text style={globalStyles.label}>
                {label} {required && <Text style={{ color: 'red' }}>*</Text>}
            </Text>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <View style={styles.container}>
                        <TouchableOpacity
                            style={[styles.trigger, isOpen && styles.triggerActive, error && { borderColor: 'red' }]}
                            onPress={() => setIsOpen(!isOpen)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.text, !value && styles.placeholder]}>
                                {/* Buscamos el nombre basado en el ID almacenado en value */}
                                {value ? options.find(opt => opt.id === (value.id || value))?.label : placeholder}
                            </Text>
                            {isOpen ? <ChevronUp size={20} color="#2D7A78" /> : <ChevronDown size={20} color="#64748B" />}
                        </TouchableOpacity>

                        {isOpen && (
                            <View style={styles.dropdown}>
                                {
                                    showEmptyOption &&
                                    <TouchableOpacity
                                        style={styles.option}
                                        onPress={() => {
                                            onChange(null); // Limpia el valor
                                            setIsOpen(false);
                                        }}>
                                        <Text style={[styles.optionText, { color: '#94a3b8', fontStyle: 'italic' }]}>
                                            -- Seleccione --
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {options.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.option}
                                        onPress={() => {
                                            onChange(item.id); // Guardamos solo el ID para el formulario
                                            setIsOpen(false);
                                        }}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            (value === item.id || value?.id === item.id) && styles.optionTextActive
                                        ]}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}
            />

            {error && <ErrorMessage message={error.message?.toString()} />}
        </View>
    );
};


const styles = StyleSheet.create({
    container: { marginVertical: 10, zIndex: 1000 },
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
    triggerActive: { borderColor: '#2D7A78' },
    text: { fontSize: 16, color: '#1E293B' },
    placeholder: { color: '#94A3B8' },
    dropdown: {
        marginTop: 4,
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
        // Sombra para que flote sobre el contenido
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
            android: { elevation: 4 }
        })
    },
    option: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    optionText: { fontSize: 16, color: '#475569' },
    optionTextActive: { color: '#2D7A78', fontWeight: 'bold' },
});
