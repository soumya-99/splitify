export const Typography = {
  h1: { fontSize: 30, fontWeight: '700' as const, lineHeight: 38 },
  h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  label: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
  tiny: { fontSize: 10, fontWeight: '500' as const, lineHeight: 14 },
};

export type TypographyVariant = keyof typeof Typography;
