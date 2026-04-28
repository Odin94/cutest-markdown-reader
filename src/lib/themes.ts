export type Theme = 'warm' | 'cool' | 'dark' | 'sepia'

export type ThemeColors = {
  background: string
  surface: string
  text: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  border: string
  muted: string
  mutedForeground: string
  ring: string
}

export const themes: Record<Theme, ThemeColors> = {
  warm: {
    background: '#FFF8F0',
    surface: '#FAF7F2',
    text: '#3C3C3C',
    primary: '#FFB5A7',
    primaryForeground: '#FFFFFF',
    secondary: '#C8A8E9',
    secondaryForeground: '#FFFFFF',
    accent: '#A8E6CF',
    accentForeground: '#3C3C3C',
    border: '#E8DCC6',
    muted: '#E8DCC6',
    mutedForeground: '#6B6B6B',
    ring: '#FFB5A7',
  },
  cool: {
    background: '#F0F4F8',
    surface: '#E8EDF3',
    text: '#2D3748',
    primary: '#90CDF4',
    primaryForeground: '#FFFFFF',
    secondary: '#A78BFA',
    secondaryForeground: '#FFFFFF',
    accent: '#81E6D9',
    accentForeground: '#2D3748',
    border: '#CBD5E0',
    muted: '#CBD5E0',
    mutedForeground: '#64748B',
    ring: '#90CDF4',
  },
  dark: {
    background: '#433E56',
    surface: '#514A69',
    text: '#F8F8F2',
    primary: '#C2FFDF',
    primaryForeground: '#2D293D',
    secondary: '#C5A3FF',
    secondaryForeground: '#2D293D',
    accent: '#FFB8D1',
    accentForeground: '#2D293D',
    border: '#716799',
    muted: '#5A5375',
    mutedForeground: '#B0BEC5',
    ring: '#C5A3FF',
  },
  sepia: {
    background: '#F4E8D0',
    surface: '#E8DCC6',
    text: '#3C3C3C',
    primary: '#C9A961',
    primaryForeground: '#FFFFFF',
    secondary: '#B8860B',
    secondaryForeground: '#FFFFFF',
    accent: '#D4A574',
    accentForeground: '#3C3C3C',
    border: '#D4C5A9',
    muted: '#D4C5A9',
    mutedForeground: '#6B5C45',
    ring: '#C9A961',
  },
}

export const applyTheme = (theme: Theme) => {
  const colors = themes[theme]
  const root = document.documentElement

  root.style.setProperty('--color-background', colors.background)
  root.style.setProperty('--color-surface', colors.surface)
  root.style.setProperty('--color-text', colors.text)
  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-secondary', colors.secondary)
  root.style.setProperty('--color-accent', colors.accent)
  root.style.setProperty('--color-border', colors.border)

  root.style.setProperty('--background', colors.background)
  root.style.setProperty('--foreground', colors.text)
  root.style.setProperty('--card', colors.surface)
  root.style.setProperty('--card-foreground', colors.text)
  root.style.setProperty('--popover', colors.surface)
  root.style.setProperty('--popover-foreground', colors.text)
  root.style.setProperty('--primary', colors.primary)
  root.style.setProperty('--primary-foreground', colors.primaryForeground)
  root.style.setProperty('--secondary', colors.secondary)
  root.style.setProperty('--secondary-foreground', colors.secondaryForeground)
  root.style.setProperty('--muted', colors.muted)
  root.style.setProperty('--muted-foreground', colors.mutedForeground)
  root.style.setProperty('--accent', colors.accent)
  root.style.setProperty('--accent-foreground', colors.accentForeground)
  root.style.setProperty('--border', colors.border)
  root.style.setProperty('--input', colors.border)
  root.style.setProperty('--ring', colors.ring)
}
