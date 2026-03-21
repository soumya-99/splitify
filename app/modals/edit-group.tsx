import Button from '@/src/components/Button';
import { SCREEN_PADDING } from '@/src/constants/layout';
import { useTheme } from '@/src/hooks/useTheme';
import { useGroupStore } from '@/src/store/useGroupStore';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GROUP_EMOJIS = ['🏖️', '🏠', '✈️', '🍕', '🎉', '🚗', '💼', '🎮', '☕', '🛒', '🎬', '💪'];

export default function EditGroupScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const updateGroup = useGroupStore((s) => s.updateGroup);
  const group = useGroupStore((s) => s.groups.find((g) => g.id === groupId));

  const [name, setName] = useState(group?.name ?? '');
  const [emoji, setEmoji] = useState(group?.emoji ?? '🏖️');
  const [currency, setCurrency] = useState(group?.currency ?? '₹');

  if (!group) return null;

  const handleUpdate = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a group name.');
      return;
    }
    updateGroup(group.id, { name: name.trim(), emoji, currency });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            accessibilityLabel="Close"
          >
            <X size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Group</Text>
          <Pressable
            onPress={handleUpdate}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            accessibilityLabel="Save group"
          >
            <Check size={24} color={colors.primary} />
          </Pressable>
        </View>

        {/* Emoji Picker */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Icon</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
          {GROUP_EMOJIS.map((e) => (
            <Pressable
              key={e}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setEmoji(e);
              }}
              style={({ pressed }) => [
                styles.emojiBtn,
                {
                  backgroundColor: emoji === e ? colors.primaryLight + '30' : colors.surface,
                  borderColor: emoji === e ? colors.primary : colors.border,
                  transform: [{ scale: pressed ? 0.9 : 1 }],
                },
              ]}
              accessibilityLabel={`Select emoji ${e}`}
            >
              <Text style={styles.emojiText}>{e}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Group Name */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Group Name</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
          placeholder="e.g., Trip to Goa"
          placeholderTextColor={colors.textTertiary}
          value={name}
          onChangeText={setName}
        />

        {/* Currency */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Currency Symbol</Text>
        <TextInput
          style={[
            styles.input,
            styles.currencyInput,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
          placeholder="₹"
          placeholderTextColor={colors.textTertiary}
          value={currency}
          onChangeText={setCurrency}
          maxLength={3}
        />

        {/* Create Button */}
        <View style={styles.createBtn}>
          <Button title="Save Changes" onPress={handleUpdate} fullWidth />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 20,
  },
  emojiRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  emojiText: {
    fontSize: 24,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  currencyInput: {
    width: 80,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
  },
  createBtn: {
    marginTop: 32,
  },
});
