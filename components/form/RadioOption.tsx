import { globalStyles } from "@/styles/style";
import { Text, TouchableOpacity } from "react-native";
import { View } from "../Themed";

interface RadioOptionProps {
    label: string;
    value: string;
    selected: string;
    onSelect: (value: string) => void;
}

const RadioOption = ({ label, value, selected, onSelect }: RadioOptionProps) => (
    <TouchableOpacity
        style={[globalStyles.radioButton, selected === value && globalStyles.radioActive]}
        onPress={() => onSelect(value)}
    >
        <View style={[globalStyles.circle, selected === value && globalStyles.circleActive]} />
        <Text style={globalStyles.radioText}>{label}</Text>
    </TouchableOpacity>
);

export default RadioOption;