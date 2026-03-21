import { FAB_SIZE, TAB_BAR_HEIGHT } from '@/src/constants/layout';
import { useTheme } from '@/src/hooks/useTheme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Activity, Home, Plus, Settings, Users } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_ICONS = [Home, Users, Activity, Settings];
const TAB_LABELS = ['Home', 'Groups', 'Activity', 'Settings'];

const TabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const { colors, shadows } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const handleFabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/modals/create-group');
  };

  const TAB_COLORS = [colors.primary, colors.secondary, colors.warning, colors.info];
  const tabWidth = width / 4;

  const translateX = useSharedValue(state.index * tabWidth);

  useEffect(() => {
    translateX.value = withTiming(state.index * tabWidth, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [state.index, tabWidth, translateX]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      {/* FAB */}
      <View style={styles.fabContainer}>
        <Pressable
          onPress={handleFabPress}
          accessible={true}
          accessibilityLabel="Create new group"
          accessibilityRole="button"
        >
          {({ pressed }) => (
            <Animated.View
              style={[
                styles.fab,
                shadows.lg,
                {
                  backgroundColor: colors.primary,
                  transform: [{ scale: pressed ? 0.9 : 1 }],
                },
              ]}
            >
              <Plus size={28} color={colors.white} strokeWidth={2.5} />
            </Animated.View>
          )}
        </Pressable>
      </View>

      {/* Tab bar */}
      <View style={[styles.container, shadows.md, { backgroundColor: colors.surface }]}>
        {/* Sliding Indicator Background */}
        <Animated.View style={[styles.indicatorContainer, { width: tabWidth }, indicatorStyle]}>
          <View style={[styles.activePill, { backgroundColor: TAB_COLORS[state.index] + '15' }]} />
        </Animated.View>

        {state.routes.map((route, index) => {
          const isActive = state.index === index;
          const Icon = TAB_ICONS[index];
          const label = TAB_LABELS[index];
          const iconColor = isActive ? TAB_COLORS[index] : colors.textSecondary;

          const handleTabPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={handleTabPress}
              style={styles.tab}
              accessibilityLabel={label}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Icon size={24} color={iconColor} strokeWidth={isActive ? 2 : 1.5} />
              <Text
                style={[styles.label, { color: iconColor, fontWeight: isActive ? '600' : '400' }]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  fabContainer: {
    position: 'absolute',
    top: -FAB_SIZE / 2,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  indicatorContainer: {
    position: 'absolute',
    height: '100%',
    padding: 8,
  },
  activePill: {
    flex: 1,
    borderRadius: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    zIndex: 1,
  },
  label: {
    fontSize: 11,
  },
});

export default TabBar;
