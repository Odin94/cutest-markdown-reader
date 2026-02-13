import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { applyTheme } from "@/lib/themes"

type Theme = "warm" | "cool" | "dark" | "sepia"

type FontFamily = "inter" | "georgia" | "jetbrains" | "system"

type Settings = {
  theme: Theme
  fontSize: number
  lineHeight: number
  fontFamily: FontFamily
}

const defaultSettings: Settings = {
  theme: "warm",
  fontSize: 16,
  lineHeight: 1.6,
  fontFamily: "inter",
}

const STORAGE_KEY = "cutest-markdown-settings"

type SettingsContextType = {
  settings: Settings
  updateTheme: (theme: Theme) => void
  updateFontSize: (size: number) => void
  updateLineHeight: (height: number) => void
  updateFontFamily: (fontFamily: FontFamily) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.error("Error reading settings from localStorage:", error)
    }
    return defaultSettings
  })

  useEffect(() => {
    applyTheme(settings.theme)
  }, [settings.theme])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error("Error writing settings to localStorage:", error)
    }
  }, [settings])

  const updateTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }))
  }

  const updateFontSize = (fontSize: number) => {
    setSettings((prev) => ({ ...prev, fontSize }))
  }

  const updateLineHeight = (lineHeight: number) => {
    setSettings((prev) => ({ ...prev, lineHeight }))
  }

  const updateFontFamily = (fontFamily: FontFamily) => {
    setSettings((prev) => ({ ...prev, fontFamily }))
  }

  return (
    <SettingsContext.Provider
      value={{ settings, updateTheme, updateFontSize, updateLineHeight, updateFontFamily }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
