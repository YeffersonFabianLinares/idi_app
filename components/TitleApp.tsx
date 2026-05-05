import { StyleSheet, Text, View } from "react-native"

interface TitleAppProps {
    title1: string
    title2?: string
}

const TitleApp = ({ title1, title2 }: TitleAppProps) => {
    return (
        <View style={styles.titleSection}>
            <Text style={styles.title}>{title1}{"\n"}
                {
                    title2 &&
                    <Text style={{ fontWeight: 'bold' }}>{title2}</Text>
                }
            </Text>
            <View style={styles.orangeLine} />
        </View>
    )
}

export default TitleApp

const styles = StyleSheet.create({
    titleSection: { marginBottom: 30 },
    title: { fontSize: 32, color: '#334155', lineHeight: 38 },
    orangeLine: { width: 50, height: 4, backgroundColor: '#ff9900', marginTop: 8 },
})