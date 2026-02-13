import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Settings, X, Palette, Type, AlignLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useSettings } from "@/stores/settingsStore"
import { applyTheme, type Theme } from "@/lib/themes"
import { cn } from "@/lib/utils"

type RightSidebarProps = {
  isOpen: boolean
  onToggle: () => void
}

const themeOptions: { value: Theme; label: string; emoji: string }[] = [
  { value: "warm", label: "Warm", emoji: "🌅" },
  { value: "cool", label: "Cool", emoji: "❄️" },
  { value: "dark", label: "Dark", emoji: "🌙" },
  { value: "sepia", label: "Sepia", emoji: "📜" },
]

const fontOptions: { value: "inter" | "georgia" | "jetbrains" | "system"; label: string }[] = [
  { value: "inter", label: "Inter" },
  { value: "georgia", label: "Georgia" },
  { value: "jetbrains", label: "JetBrains Mono" },
  { value: "system", label: "System" },
]

export const RightSidebar = ({ isOpen, onToggle }: RightSidebarProps) => {
  const { settings, updateTheme, updateFontSize, updateLineHeight, updateFontFamily } = useSettings()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<number>()

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      setIsScrolling(true)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 1000)
    }

    container.addEventListener("scroll", handleScroll)
    return () => {
      container.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isOpen])

  const handleThemeChange = (theme: Theme) => {
    updateTheme(theme)
    applyTheme(theme)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-surface/95 backdrop-blur-md border-l border-border shadow-xl z-40 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div
              ref={scrollContainerRef}
              className={cn(
                "flex-1 overflow-y-auto px-8 py-8 space-y-10 outline-scrollbar",
                isScrolling && "scrolling"
              )}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Palette className="h-4 w-4" />
                  Theme
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {themeOptions.map((option) => (
                    <motion.div
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={settings.theme === option.value ? "default" : "outline"}
                        onClick={() => handleThemeChange(option.value)}
                        className="h-auto py-3 flex flex-col items-center gap-1 w-full"
                      >
                        <span className="text-xl">{option.emoji}</span>
                        <span className="text-xs">{option.label}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Type className="h-4 w-4" />
                  Font Family
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {fontOptions.map((option) => (
                    <motion.div
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={settings.fontFamily === option.value ? "default" : "outline"}
                        onClick={() => updateFontFamily(option.value)}
                        className="w-full h-auto py-2.5 text-sm"
                        style={{
                          fontFamily: option.value === "inter" ? "Inter, sans-serif" :
                                     option.value === "georgia" ? "Georgia, serif" :
                                     option.value === "jetbrains" ? "'JetBrains Mono', monospace" :
                                     "system-ui, sans-serif"
                        }}
                      >
                        {option.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Type className="h-4 w-4" />
                  Font Size
                </div>
                <div className="space-y-2">
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => updateFontSize(value)}
                    min={14}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>14px</span>
                    <span className="font-medium">{settings.fontSize}px</span>
                    <span>24px</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <AlignLeft className="h-4 w-4" />
                  Line Height
                </div>
                <div className="space-y-2">
                  <Slider
                    value={[settings.lineHeight]}
                    onValueChange={([value]) => updateLineHeight(value)}
                    min={1.4}
                    max={2.2}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1.4</span>
                    <span className="font-medium">{settings.lineHeight.toFixed(1)}</span>
                    <span>2.2</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        ) : (
          <motion.button
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={onToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed right-4 top-20 z-40 h-10 w-10 rounded-full bg-surface/90 backdrop-blur-md border border-border shadow-lg flex items-center justify-center hover:bg-accent/50 transition-colors"
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
