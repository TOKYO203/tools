export const colors = {
  canvas: '#F7F8F6',
  surface: '#FFFFFF',
  ink: '#0E1B1A',
  muted: '#586864',
  line: '#E2E7E4',
  teal: '#0A7B72',
  tealDark: '#0B3532',
  tealDeep: '#092826',
  mint: '#E4F6F1',
  mintStrong: '#B2EBDB',
  blue: '#2657DB',
  blueSoft: '#E8F0FF',
  amber: '#B96A13',
  amberSoft: '#FFF2D9',
  violet: '#6754C6',
  violetDark: '#2F235F',
  violetDeep: '#14142E',
  violetSoft: '#F2EFFE',
  danger: '#B94141',
  white: '#FFFFFF',
} as const;

export const spacing = { xs: 6, sm: 10, md: 16, lg: 22, xl: 30 } as const;
export const radius = { sm: 14, md: 20, lg: 26, xl: 28, pill: 999 } as const;

export const shadow = {
  shadowColor: '#051714',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.06,
  shadowRadius: 24,
  elevation: 3,
} as const;

export const shadowStrong = {
  shadowColor: '#051714',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.10,
  shadowRadius: 28,
  elevation: 5,
} as const;
