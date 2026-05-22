import { Menu } from "@/interfaces/Menu"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"

interface MenuGeneralProps {
    options: Menu[]
}

const MenuGeneral = ({ options }: MenuGeneralProps) => {

    const router = useRouter()
    const redirect = (link: string, type?: string) => {
        router.push(
            {
                pathname: link as any,
                params: { type: type }
            }
        )
    }

    return (
        <View>
            {options.map((item, index) => (
                <Animated.View
                    key={index}
                    entering={FadeInUp.delay(200 * index).springify()}
                >
                    <TouchableOpacity style={styles.optionButton} activeOpacity={0.7} onPress={() => redirect(item.link, item.type)}>
                        <View style={styles.iconCircle}>
                            {item.icon}
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.optionTitle}>{item.title}</Text>
                            <Text style={styles.optionSub}>{item.subtitle}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                </Animated.View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ff9900',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    textContainer: { flex: 1 },
    optionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    optionSub: { fontSize: 14, color: '#777' },
})

export default MenuGeneral