import { useColorScheme } from 'react-native';
import { Colors, Spacing, Typography, Shadows } from '@/src/theme';
import type { ThemeColors } from '@/src/theme';

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors: ThemeColors = isDark ? Colors.dark : Colors.light;

  return {
    colors,
    spacing: Spacing,
    typography: Typography,
    shadows: Shadows,
    isDark,
  };
}
