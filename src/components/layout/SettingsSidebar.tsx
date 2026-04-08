import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { MarkdownHistoryEntry } from "@/hooks/useLocalStorage"
import { applyTheme, type Theme } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { useSettings } from "@/stores/settingsStore"
import { AnimatePresence, motion } from "framer-motion"
import { AlignLeft, Check, ChevronRight, ExternalLink, History, Palette, Settings, Trash2, Type, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type SettingsSidebarProps = {
  isOpen: boolean
  onToggle: () => void
  historyEntries: MarkdownHistoryEntry[]
  selectedHistoryEntryId: string
  onHistoryEntrySelect: (id: string) => void
  onHistoryEntryDelete: (id: string) => void
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

export const SettingsSidebar = ({
  isOpen,
  onToggle,
  historyEntries,
  selectedHistoryEntryId,
  onHistoryEntrySelect,
  onHistoryEntryDelete,
}: SettingsSidebarProps) => {
  const { settings, updateTheme, updateFontSize, updateLineHeight, updateFontFamily } = useSettings()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [pendingDeleteEntryId, setPendingDeleteEntryId] = useState<string | null>(null)
  const [hoverSuppressedEntryId, setHoverSuppressedEntryId] = useState<string | null>(null)
  const scrollTimeoutRef = useRef<number>()
  const hoverSuppressTimeoutRef = useRef<number>()

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
      if (hoverSuppressTimeoutRef.current) {
        clearTimeout(hoverSuppressTimeoutRef.current)
      }
    }
  }, [isOpen])

  const handleThemeChange = (theme: Theme) => {
    updateTheme(theme)
    applyTheme(theme)
  }

  const handleDeleteIntent = (entry: MarkdownHistoryEntry) => {
    if (entry.id === selectedHistoryEntryId) {
      return
    }

    setPendingDeleteEntryId(entry.id)
    setHoverSuppressedEntryId(entry.id)
    if (hoverSuppressTimeoutRef.current) {
      clearTimeout(hoverSuppressTimeoutRef.current)
    }
    hoverSuppressTimeoutRef.current = window.setTimeout(() => {
      setHoverSuppressedEntryId(null)
    }, 180)
  }

  const handleDeleteAbort = () => {
    setPendingDeleteEntryId(null)
    setHoverSuppressedEntryId(null)
  }

  const handleDeleteConfirm = (entry: MarkdownHistoryEntry) => {
    if (entry.id === selectedHistoryEntryId) {
      return
    }

    onHistoryEntryDelete(entry.id)
    setPendingDeleteEntryId(null)
    setHoverSuppressedEntryId(null)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            key="settings-sidebar"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-surface/95 backdrop-blur-md border-l border-border shadow-xl z-40 flex flex-col"
          >
            <div className="flex items-center justify-between p-2 border-b border-border">
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
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div
              ref={scrollContainerRef}
              className={cn(
                "flex-1 overflow-y-auto p-2 space-y-7 outline-scrollbar",
                isScrolling && "scrolling"
              )}
            >
              <div className="space-y-2">
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

              <div className="space-y-2">
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
                    min={1.0}
                    max={2.5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1.0</span>
                    <span className="font-medium">{settings.lineHeight.toFixed(1)}</span>
                    <span>2.5</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <History className="h-4 w-4" />
                  Markdown History
                </div>
                <motion.div layout className="space-y-2">
                  <AnimatePresence initial={false}>
                    {historyEntries.map((entry, index) => {
                      const isSelected = entry.id === selectedHistoryEntryId
                      const isConfirmingDelete = entry.id === pendingDeleteEntryId
                      const suppressHover = entry.id === hoverSuppressedEntryId

                      return (
                        <motion.div
                          key={entry.id}
                          layout
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 24, scale: 0.96 }}
                          transition={{
                            layout: { type: "spring", stiffness: 380, damping: 32 },
                            opacity: { duration: 0.18 },
                            y: { type: "spring", stiffness: 420, damping: 30 },
                          }}
                          className="relative"
                        >
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => onHistoryEntrySelect(entry.id)}
                            className="h-auto w-full cursor-pointer items-start justify-between px-3 py-3 pr-24 text-left"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium">
                                {entry.title}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {index === 0 ? "Current markdown" : "History entry"}
                              </div>
                            </div>
                            {isSelected ? (
                              <div className="absolute right-2 top-2 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1 text-[11px] font-medium text-foreground">
                                  <Check className="h-3 w-3" />
                                  Selected
                                </span>
                              </div>
                            ) : null}
                          </Button>
                          {!isSelected ? (
                            <div className="absolute right-2 top-2 flex items-center gap-1">
                              {isConfirmingDelete ? (
                                <>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      handleDeleteConfirm(entry)
                                    }}
                                    className={cn(
                                      "h-8 w-8 cursor-pointer text-muted-foreground",
                                      suppressHover
                                        ? "pointer-events-none"
                                        : "hover:bg-emerald-500/10 hover:text-emerald-600"
                                    )}
                                    aria-label={`Confirm deleting ${entry.title} from history`}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      handleDeleteAbort()
                                    }}
                                    className={cn(
                                      "h-8 w-8 cursor-pointer text-muted-foreground",
                                      suppressHover
                                        ? "pointer-events-none"
                                        : "hover:bg-primary hover:text-primary-foreground"
                                    )}
                                    aria-label={`Cancel deleting ${entry.title} from history`}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onMouseDown={(event) => event.preventDefault()}
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    handleDeleteIntent(entry)
                                  }}
                                  className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-destructive"
                                  aria-label={`Delete ${entry.title} from history`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ) : null}
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
            <div className="w-full p-4 border-t border-border flex justify-center items-center">
              <a
                href="https://odin-matthias.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <span>odin-matthias.de</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
      {!isOpen ? (
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
      ) : null}
    </>
  )
}
