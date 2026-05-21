import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
    title: string
    canGoBack?: boolean
    onBackPress?: () => void;
};

const Header = ({ title, canGoBack, onBackPress }: HeaderProps) => {
    const insets = useSafeAreaInsets()
    const router = useRouter();

    const handleBack = () => {
        // Si pasamos una función personalizada (ej. para mostrar alerta), la usamos
        if (onBackPress) {
            onBackPress();
        } else {
            // Si no, volvemos atrás normalmente
            router.back();
        }
    };

    return (
        <SafeAreaView style={[styles.header]} edges={['top', 'left']}>
            {
                canGoBack && (
                    <TouchableOpacity
                        onPress={handleBack}
                    >
                        <Feather name="arrow-left" color="#FFF" size={20} />
                    </TouchableOpacity>
                )
            }
            <Text style={styles.headerTitle}>{title}</Text>
        </SafeAreaView>
    )
}

export default Header

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#00A6A6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
})