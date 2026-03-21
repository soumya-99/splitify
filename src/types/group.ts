import type { Member } from './member';

export interface Group {
  id: string;
  name: string;
  emoji: string;
  currency: string;
  members: Member[];
  createdAt: string;
  updatedAt: string;
}
