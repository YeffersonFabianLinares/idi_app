import { globalStyles } from '@/styles/style';
import DateTimePicker, { DatePickerOptions, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar, CircleX } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import ErrorMessage from '../ErrorMessage';

interface Props extends DatePickerOptions {
    name: string;
    label: string;
    required?: boolean
    canClear?: boolean
}

export const InputDate = ({ name, label, required = true, canClear = true, ...datePickerOptions }: Props) => {
    const { control, formState: { errors }, setValue } = useFormContext();
    const [show, setShow] = useState(false);
    const error = errors[name];

    // Función para formatear la fecha visualmente
    const formatDate = (date: Date | undefined) => {
        if (!date) return 'dd/mm/aaaa';
        return date.getDate().toString().padStart(2, '0') + '/' +
            (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
            date.getFullYear();
    };

    const onClose = () => {
        setShow(false)
    }

    const renderPicker = (onChange: any, value: any) => {
        const picker = (
            <DateTimePicker
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                {...datePickerOptions}
                value={value instanceof Date ? value : (value ? new Date(value) : new Date())}
                locale="es-ES"
                textColor="black"
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                    if (Platform.OS === 'android') {
                        setShow(false); // Android cierra al dar "OK"
                        if (event.type === 'set' && selectedDate) {
                            setValue(name, selectedDate, { shouldValidate: true });
                            onChange(selectedDate);
                        }
                    } else {
                        // iOS actualiza mientras gira
                        if (selectedDate) {
                            setValue(name, selectedDate, { shouldValidate: true });
                            onChange(selectedDate);
                        }
                    }
                }}
            />
        );

        if (Platform.OS === 'ios') {
            return (
                <Modal transparent animationType="slide" visible={show}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                        <View style={{ backgroundColor: '#f8f8f8', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                            <Text style={{ color: '#666', fontSize: 16 }}>Selecciona la fecha</Text>
                            <TouchableOpacity onPress={() => {
                                setValue(name, null, { shouldValidate: true });
                                setShow(false);
                            }}>
                                <Text style={{ color: '#d32f2f', fontSize: 16, fontWeight: '600' }}>Limpiar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShow(false)} style={{ backgroundColor: '#2D7A78', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8 }}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Listo</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: 'white', paddingBottom: 40 }}>
                            {picker}
                        </View>
                    </View>
                </Modal>
            );
        }

        return show ? picker : null;
    };

    return (
        <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.label}>
                {label} {required && <Text style={{ color: 'red' }}>*</Text>}
            </Text>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <>
                        <TouchableOpacity
                            style={[globalStyles.inputWithIcon, error && { borderColor: 'red' }]}
                            onPress={() => {
                                if (!control._formValues[name]) {
                                    const today = new Date();
                                    setValue(name, today, { shouldValidate: true });
                                }
                                setShow(true);
                            }}
                            activeOpacity={0.8}
                        >
                            <Calendar size={20} color="#9ca3af" style={globalStyles.iconLeft} />
                            <Text style={[globalStyles.inputFlex, { color: !value ? '#9ca3af' : '#000', lineHeight: 50 }]}>
                                {formatDate(value)}
                            </Text>
                            {(value && canClear) ? (
                                <TouchableOpacity
                                    onPress={() => setValue(name, null, { shouldValidate: true })}
                                    style={{ padding: 10 }}
                                >
                                    <CircleX size={20} color="red" />
                                </TouchableOpacity>
                            ) : (
                                <Calendar size={20} color="#2D7A78" style={globalStyles.iconRight} />
                            )}
                        </TouchableOpacity>

                        {renderPicker(onChange, value)}
                    </>
                )}
            />
            {error && <ErrorMessage message={error.message?.toString()} />}
        </View>
    );
};
