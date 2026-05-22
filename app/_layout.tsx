import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import Header from '@/components/Header';
import { useColorScheme } from '@/components/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: './Home',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#2D7A78', height: 'auto', minHeight: 80, width: '92%', paddingVertical: 10 }} // Más alto y ancho
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 18, fontWeight: 'bold', color: '#00A6A6' }} // Texto más grande
      text2Style={{ fontSize: 14, color: '#666' }}
      text2NumberOfLines={0}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#FF5252', height: 'auto', minHeight: 80, width: '92%', paddingVertical: 10 }}
      text1Style={{ fontSize: 18, fontWeight: 'bold', color: '#D13434' }}
      text2Style={{ fontSize: 14 }}
      text2NumberOfLines={0}
    />
  ),
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            header: ({ options, navigation }) => {
              const customBack = (options as any).onBackPress;
              return (
                <Header
                  title='IDIME S.A.'
                  canGoBack={navigation.canGoBack()}
                  onBackPress={customBack}
                />
              )
            }
          }}>
        </Stack>
        <Toast
          config={toastConfig}
          topOffset={60} />
      </ThemeProvider>
      {/* <Footer /> */}
    </SafeAreaProvider>
  );
}
