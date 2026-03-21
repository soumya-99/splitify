import Card from '@/src/components/Card';
import { SCREEN_PADDING } from '@/src/constants/layout';
import { useTheme } from '@/src/hooks/useTheme';
import { importGroupFromSpt, exportAllGroupsToZip } from '@/src/services/shareService';
import { useExpenseStore } from '@/src/store/useExpenseStore';
import { useGroupStore } from '@/src/store/useGroupStore';
import { ChevronRight, Moon, Sun, Trash2, Upload, Download } from 'lucide-react-native';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
}

function SettingsRow({ icon, title, subtitle, onPress, danger }: SettingsRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.borderLight, opacity: pressed ? 0.7 : 1 },
      ]}
      accessibilityLabel={title}
    >
      <View style={styles.rowLeft}>
        {icon}
        <View style={styles.rowText}>
          <Text style={[styles.rowTitle, { color: danger ? colors.danger : colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.rowSub, { color: colors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      <ChevronRight size={20} color={colors.textTertiary} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const groupStore = useGroupStore();
  const expenseStore = useExpenseStore();

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all groups, expenses, and settlements. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => {
            groupStore.loadGroups([]);
            expenseStore.loadData([], []);
          },
        },
      ]
    );
  };

  const handleImport = async () => {
    try {
      const data = await importGroupFromSpt();
      if (data) {
        // Prevent importing if group already exists
        if (groupStore.groups.find((g) => g.id === data.group.id)) {
          Alert.alert('Duplicate', 'This group already exists in your app.');
          return;
        }

        groupStore.loadGroups([data.group, ...groupStore.groups]);

        expenseStore.loadData(
          [...data.expenses, ...expenseStore.expenses],
          [...data.settlements, ...expenseStore.settlements]
        );

        Alert.alert('Success', `Imported group: ${data.group.name}`);
      }
    } catch {
      Alert.alert('Error', 'Failed to import group file');
    }
  };

  const handleExportAll = async () => {
    try {
      if (groupStore.groups.length === 0) {
        Alert.alert('Empty', 'You have no groups to export.');
        return;
      }
      await exportAllGroupsToZip(
        groupStore.groups,
        expenseStore.expenses,
        expenseStore.settlements
      );
    } catch {
      Alert.alert('Error', 'Failed to generate backup.');
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top + 16 },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
        <SettingsRow
          icon={
            isDark ? (
              <Moon size={22} color={colors.primary} />
            ) : (
              <Sun size={22} color={colors.warning} />
            )
          }
          title="Theme"
          subtitle={isDark ? 'Dark Mode' : 'Light Mode'}
          onPress={() => {
            Alert.alert('Theme', 'Theme follows your system settings automatically.');
          }}
        />
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DATA</Text>
        <SettingsRow
          icon={<Upload size={22} color={colors.info} />}
          title="Import Group"
          subtitle="Load a .spt Splitify file"
          onPress={handleImport}
        />
        <SettingsRow
          icon={<Download size={22} color={colors.secondary} />}
          title="Export All Groups"
          subtitle="Create a ZIP backup of all groups"
          onPress={handleExportAll}
        />
        <SettingsRow
          icon={<Trash2 size={22} color={colors.danger} />}
          title="Clear All Data"
          subtitle="Delete all groups and expenses"
          onPress={handleClearData}
          danger
        />
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Version</Text>
          <Text style={[styles.aboutValue, { color: colors.text }]}>1.0.0</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Made with</Text>
          <Text style={[styles.aboutValue, { color: colors.accent }]}>💜 Splitify</Text>
        </View>
      </Card>

      <View style={{ height: 120 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SCREEN_PADDING,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  rowSub: {
    fontSize: 13,
    marginTop: 1,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  aboutLabel: {
    fontSize: 15,
  },
  aboutValue: {
    fontSize: 15,
    fontWeight: '500',
  },
});
