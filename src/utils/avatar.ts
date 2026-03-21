const AVATAR_COLORS = [
  '#6C5CE7',
  '#00B894',
  '#FD79A8',
  '#FDCB6E',
  '#74B9FF',
  '#E17055',
  '#A29BFE',
  '#55EFC4',
  '#FF7675',
  '#81ECEC',
  '#FAB1C8',
  '#FFEAA7',
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
