import type { Expense, Group, Settlement } from '@/src/types';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import JSZip from 'jszip';

export interface SplitifyExportData {
  version: number;
  group: Group;
  expenses: Expense[];
  settlements: Settlement[];
}

export async function exportGroupToSpt(
  group: Group,
  expenses: Expense[],
  settlements: Settlement[]
): Promise<void> {
  try {
    const data: SplitifyExportData = {
      version: 1,
      group,
      expenses,
      settlements,
    };

    const fileName = `${group.name.replace(/[^a-zA-Z0-9]/g, '_')}_${group.id.slice(0, 6)}.spt`;
    const file = new File(Paths.cache, fileName);

    file.write(JSON.stringify(data));

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        UTI: 'public.json',
        mimeType: 'application/json',
        dialogTitle: `Share ${group.name} Splitify data`,
      });
    }
  } catch (error) {
    console.error('Failed to export group', error);
    throw new Error('Failed to export group');
  }
}

export async function exportAllGroupsToZip(
  groups: Group[],
  expenses: Expense[],
  settlements: Settlement[]
): Promise<void> {
  try {
    const zip = new JSZip();

    for (const group of groups) {
      const gExpenses = expenses.filter((e) => e.groupId === group.id);
      const gSettlements = settlements.filter((s) => s.groupId === group.id);

      const data: SplitifyExportData = {
        version: 1,
        group,
        expenses: gExpenses,
        settlements: gSettlements,
      };

      const fileName = `${group.name.replace(/[^a-zA-Z0-9]/g, '_')}_${group.id.slice(0, 6)}.spt`;
      zip.file(fileName, JSON.stringify(data));
    }

    const zipContent = await zip.generateAsync({ type: 'uint8array' });

    const zipFile = new File(Paths.cache, 'Splitify_Backup.zip');
    zipFile.write(zipContent);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(zipFile.uri, {
        UTI: 'public.zip-archive',
        mimeType: 'application/zip',
        dialogTitle: 'Share Splitify Backup',
      });
    }
  } catch (error) {
    console.error('Failed to export all groups', error);
    throw new Error('Failed to export zip backup');
  }
}

export async function importGroupFromSpt(): Promise<SplitifyExportData | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['*/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const file = new File(result.assets[0].uri);
    const fileContent = await file.text();

    const parsedData = JSON.parse(fileContent);

    if (!parsedData || !parsedData.group || !parsedData.expenses) {
      throw new Error('Invalid Splitify data file');
    }

    return parsedData as SplitifyExportData;
  } catch (error) {
    console.error('Failed to import group', error);
    throw new Error('Failed to import group file');
  }
}
