import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const customDark = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#1A1A2E',
      card: '#16213E',
      primary: '#A29BFE',
    },
  };

  const customLight = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F8F9FE',
      card: '#FFFFFF',
      primary: '#6C5CE7',
    },
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? customDark : customLight}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor:
              colorScheme === 'dark' ? customDark.colors.background : customLight.colors.background,
          },
          animation: 'default',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modals/create-group" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modals/edit-group" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
