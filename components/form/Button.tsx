import { globalStyles } from "@/styles/style"
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native"

interface ButtonProps extends TouchableOpacityProps {
    title: string

}

export const Button = ({ title, ...rest }: ButtonProps) => {
    return (
        <>
            <TouchableOpacity
                style={globalStyles.button}
                activeOpacity={0.8}
                {...rest}
            >
                <Text style={globalStyles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </>
    )
}

export default Button