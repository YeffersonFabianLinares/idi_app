import Button from "@/components/form/Button"
import { Input } from "@/components/form/Input"
import { InputDate } from "@/components/form/InputDate"
import { RadioButton } from "@/components/form/RadioButton"
import { Select } from "@/components/form/Select"
import TitleApp from "@/components/TitleApp"
import { FormSpeciality, formSpeciality } from "@/schemas/formSpeciality.schema"
import { globalStyles } from "@/styles/style"
import { zodResolver } from "@hookform/resolvers/zod"
import { useHeaderHeight } from "@react-navigation/elements"
import { FormProvider, useForm } from "react-hook-form"
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native"

const Page = () => {
    
    const headerHeight = useHeaderHeight();

    const methods = useForm<FormSpeciality>({
        resolver: zodResolver(formSpeciality)
    })


    const onSubmit = (data: any) => {
        // console.log('data ==> ', data);
    }

    return (
        <View style={globalStyles.container}>
            <FormProvider {...methods}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={headerHeight + 20}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
                            <TitleApp
                                title1="Solicita tu"
                                title2="cita" />
                            <View>
                                <View>
                                    <Select
                                        label="Estás interesado en:"
                                        name=""
                                        placeholder="Servicio de interés"
                                        options={[]}
                                    />
                                </View>
                                <View>
                                    <Input
                                        label="Nombres y apellidos"
                                        name=""
                                        placeholder="Nombres y apellidos"
                                    />
                                </View>
                                <View>
                                    <Select
                                        label="Tipo de identificación"
                                        name=""
                                        placeholder="Tipo de identificación"
                                        options={[]}
                                    />
                                </View>
                                <View>
                                    <Input
                                        label="Número de documento"
                                        name=""
                                        placeholder="Número de documento"
                                    />
                                </View>
                                <View>
                                    <InputDate
                                        label="Fecha de nacimiento"
                                        name=""
                                        value={new Date()}
                                    />
                                </View>
                                <View>
                                    <Select
                                        label="Ciudad"
                                        name=""
                                        placeholder="Ciudad"
                                        options={[]}
                                    />
                                </View>
                                <View>
                                    <Input
                                        label="Email"
                                        name=""
                                        keyboardType="email-address"
                                    />
                                </View>
                                <View>
                                    <Input
                                        label="Teléfono de contacto"
                                        name=""
                                        keyboardType="phone-pad"
                                    />
                                </View>
                                <View>
                                    <Select
                                        label="¿Cómo nos encontraste?"
                                        name=""
                                        options={[]}
                                    />
                                </View>
                                <View>
                                    <Input
                                        label="Entidad"
                                        name=""
                                    />
                                </View>
                                <View>
                                    <Input
                                        label="Escribe el nombre del procedimiento tal cual apareceen la orden y/o autorización médica:"
                                        name=""
                                    />
                                </View>
                                <View>
                                    <Select
                                        label="Indicanos si tienes alguna de esas incapacidades"
                                        name=""
                                        options={[]}
                                    />
                                </View>
                                <View>
                                    <RadioButton
                                        label=""
                                        name=""
                                        options={[
                                            {
                                                label: '¿Autorizas y aceptas el tratamiento de datos por parte de nuestra organización?',
                                                value: '1'
                                            }
                                        ]}
                                    />
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                                    <Button
                                        onPress={methods.handleSubmit(onSubmit)}
                                        title="Enviar"
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </FormProvider>
        </View>
    )
}

export default Page

const styles = StyleSheet.create({
    titleSection: { marginBottom: 30 },
    title: { fontSize: 32, color: '#334155', lineHeight: 38 },
    orangeLine: { width: 50, height: 4, backgroundColor: '#ff9900', marginTop: 8 },
})