import { Hct, hexFromArgb } from '@material/material-color-utilities';

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;

  // HCT arguments (Hue, Chroma, Tone).
  // Tone 75 and Chroma 45 produces a nice Material You vibrant pastel that works well for avatars.
  const hct = Hct.from(hue, 40, 70);
  return hexFromArgb(hct.toInt());
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
