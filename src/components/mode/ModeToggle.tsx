import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSettings } from "@/stores/settingsStore"

type Mode = "write" | "read"

type ModeToggleProps = {
  mode: Mode
  onModeChange: (mode: Mode) => void
  opacity?: number
}

export const ModeToggle = ({
  mode,
  onModeChange,
  opacity = 1,
}: ModeToggleProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const { settings } = useSettings()
  const isDark = settings.theme === "dark"

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isHovered ? 1 : opacity, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-surface/90 backdrop-blur-md rounded-full p-2 border border-border shadow-md"
    >
      <Button
        variant={mode === "write" ? "default" : "ghost"}
        size="default"
        onClick={() => onModeChange("write")}
        className={cn(
          "rounded-full transition-all relative px-6 py-2",
          mode === "write" ? "shadow-sm" : "",
          isDark && mode === "write" ? "bg-primary text-[#2D293D] hover:bg-accent/50 hover:text-[#2D293D]" : ""
        )}
      >
        <Edit className="h-5 w-5 mr-2" />
        Write
        {mode === "write" && (
          <motion.div
            layoutId="activeMode"
            className="absolute inset-0 rounded-full bg-secondary/30 -z-10"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Button>
      <Button
        variant={mode === "read" ? "default" : "ghost"}
        size="default"
        onClick={() => onModeChange("read")}
        className={cn(
          "rounded-full transition-all relative px-6 py-2",
          mode === "read" ? "shadow-sm" : "",
          isDark && mode === "read" ? "bg-primary text-[#2D293D] hover:bg-accent/50 hover:text-[#2D293D]" : ""
        )}
      >
        <BookOpen className="h-5 w-5 mr-2" />
        Read
        {mode === "read" && (
          <motion.div
            layoutId="activeMode"
            className="absolute inset-0 rounded-full bg-secondary/30 -z-10"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Button>
    </motion.div>
  )
}
