import { globalStyles } from '@/styles/style';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import ErrorMessage from '../ErrorMessage';

interface Option {
    label: string;
    value: string;
}

interface Props {
    name: string;
    label: string;
    options: Option[];
    required?: boolean
}

export const RadioButton = ({ name, label, options, required = true }: Props) => {
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
                render={({ field: { onChange, value } }) => (
                    <View style={globalStyles.radioContainer}>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    globalStyles.radioButton,
                                    value === option.value && globalStyles.radioActive
                                ]}
                                onPress={() => onChange(option.value)}
                            >
                                <View style={[
                                    globalStyles.circle,
                                    value === option.value && globalStyles.circleActive
                                ]} />
                                <Text style={globalStyles.radioText}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />

            {error && (
                <ErrorMessage message={error.message?.toString()} />
            )}
        </View>
    );
};
