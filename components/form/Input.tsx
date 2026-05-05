import { globalStyles } from '@/styles/style';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import ErrorMessage from '../ErrorMessage';

interface Input extends TextInputProps {
    name: string;
    label: string;
    rightIcon?: React.ReactNode;
    required?: boolean
}

export const Input = ({ name, label, rightIcon, required = true, ...textInputProps }: Input) => {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name];

    return (
        <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.label}>
                {label} {required && <Text style={{ color: 'red' }}>*</Text>}
            </Text>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value, onBlur } }) => (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'stretch', // Cambiamos a stretch para que la caja ocupe todo el alto
                        backgroundColor: '#fff', // O el color de fondo de tu input
                        borderRadius: 8, // Ajusta según el radio de tus inputs
                        borderWidth: .5,
                        borderColor: error ? 'red' : '#d1d5db', // Borde general del contenedor
                        overflow: 'hidden'
                    }}>
                        <TextInput
                            style={[globalStyles.input, error && globalStyles.inputError, { flex: 1, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderBottomWidth: 0 }]}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            placeholderTextColor="#9ca3af"
                            {...textInputProps}
                        />
                        {rightIcon && <View style={{
                            width: 50, // Ancho fijo para la "caja"
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f3f4f6', // Color de fondo sutil para diferenciar la caja
                            borderLeftWidth: 1,
                            borderLeftColor: error ? 'red' : '#d1d5db', // Línea divisoria
                        }}>{rightIcon}</View>}
                    </View>
                )}
            />

            {error && (
                <ErrorMessage message={error.message?.toString()} />
            )}
        </View>
    );
};