import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Group, Member } from '@/src/types';
import { generateId } from '@/src/utils/id';
import { getAvatarColor } from '@/src/utils/avatar';
import { zustandStorage } from './storage';

interface GroupState {
  groups: Group[];
}

interface GroupActions {
  addGroup: (name: string, emoji: string, currency: string, memberNames: string[]) => Group;
  updateGroup: (id: string, updates: Partial<Pick<Group, 'name' | 'emoji' | 'currency'>>) => void;
  addMemberToGroup: (groupId: string, memberName: string) => void;
  removeGroup: (id: string) => void;
  getGroup: (id: string) => Group | undefined;
  loadGroups: (groups: Group[]) => void;
}

type GroupStore = GroupState & GroupActions;

export const useGroupStore = create<GroupStore>()(
  persist(
    (set, get) => ({
      groups: [],

      addGroup: (name, emoji, currency, memberNames) => {
        const members: Member[] = memberNames.map((n) => ({
          id: generateId(),
          name: n.trim(),
          avatarColor: getAvatarColor(n.trim()),
        }));

        const group: Group = {
          id: generateId(),
          name,
          emoji,
          currency,
          members,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({ groups: [group, ...state.groups] }));
        return group;
      },

      updateGroup: (id, updates) => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
          ),
        }));
      },

      addMemberToGroup: (groupId, memberName) => {
        const newMember: Member = {
          id: generateId(),
          name: memberName.trim(),
          avatarColor: getAvatarColor(memberName.trim()),
        };
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId
              ? { ...g, members: [...g.members, newMember], updatedAt: new Date().toISOString() }
              : g
          ),
        }));
      },

      removeGroup: (id) => {
        set((state) => ({ groups: state.groups.filter((g) => g.id !== id) }));
      },

      getGroup: (id) => {
        return get().groups.find((g) => g.id === id);
      },

      loadGroups: (groups) => {
        set({ groups });
      },
    }),
    {
      name: 'splitify-group-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
