import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

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

  return (
    <FavoritesProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0F1F3D' },
          headerTintColor: '#FFCB05',
          headerTitleStyle: {
            fontWeight: '800',
            color: '#FFCB05',
          },
          contentStyle: { backgroundColor: '#0B1929' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="pokemon/[id]"
          options={{
            title: 'รายละเอียด',
          }}
        />
        <Stack.Screen
          name="type/[type]"
          options={{
            title: 'ชนิดโปเกมอน',
          }}
        />
      </Stack>
    </FavoritesProvider>
  );
}
