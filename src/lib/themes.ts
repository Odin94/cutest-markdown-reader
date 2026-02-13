export type Theme = "warm" | "cool" | "dark" | "sepia"

export type ThemeColors = {
  background: string
  surface: string
  text: string
  primary: string
  secondary: string
  accent: string
  border: string
}

export const themes: Record<Theme, ThemeColors> = {
  warm: {
    background: "#FFF8F0",
    surface: "#FAF7F2",
    text: "#3C3C3C",
    primary: "#FFB5A7",
    secondary: "#C8A8E9",
    accent: "#A8E6CF",
    border: "#E8DCC6",
  },
  cool: {
    background: "#F0F4F8",
    surface: "#E8EDF3",
    text: "#2D3748",
    primary: "#90CDF4",
    secondary: "#A78BFA",
    accent: "#81E6D9",
    border: "#CBD5E0",
  },
  dark: {
    background: "#1A1A1A",
    surface: "#2D2D2D",
    text: "#E5E5E5",
    primary: "#FF6B6B",
    secondary: "#A78BFA",
    accent: "#4ECDC4",
    border: "#404040",
  },
  sepia: {
    background: "#F4E8D0",
    surface: "#E8DCC6",
    text: "#3C3C3C",
    primary: "#C9A961",
    secondary: "#B8860B",
    accent: "#D4A574",
    border: "#D4C5A9",
  },
}

export const applyTheme = (theme: Theme) => {
  const colors = themes[theme]
  const root = document.documentElement
  
  root.style.setProperty("--color-background", colors.background)
  root.style.setProperty("--color-surface", colors.surface)
  root.style.setProperty("--color-text", colors.text)
  root.style.setProperty("--color-primary", colors.primary)
  root.style.setProperty("--color-secondary", colors.secondary)
  root.style.setProperty("--color-accent", colors.accent)
  root.style.setProperty("--color-border", colors.border)
  
  root.style.setProperty("--background", colors.background)
  root.style.setProperty("--foreground", colors.text)
  root.style.setProperty("--card", colors.surface)
  root.style.setProperty("--card-foreground", colors.text)
  root.style.setProperty("--popover", colors.surface)
  root.style.setProperty("--popover-foreground", colors.text)
  root.style.setProperty("--primary", colors.primary)
  root.style.setProperty("--secondary", colors.secondary)
  root.style.setProperty("--muted", colors.border)
  root.style.setProperty("--accent", colors.accent)
  root.style.setProperty("--border", colors.border)
  root.style.setProperty("--input", colors.border)
  root.style.setProperty("--ring", colors.primary)
}
