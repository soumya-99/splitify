export function generateId(): string {
  const chars = 'abcdef0123456789';
  const sections = [8, 4, 4, 4, 12];
  return sections
    .map((len) => {
      let s = '';
      for (let i = 0; i < len; i++) {
        s += chars[Math.floor(Math.random() * chars.length)];
      }
      return s;
    })
    .join('-');
}
