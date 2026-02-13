import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LeftSidebar } from "./LeftSidebar"
import { SettingsSidebar } from "./SettingsSidebar"
import { ModeToggle } from "../mode/ModeToggle"

type Mode = "write" | "read"

type AppLayoutProps = {
  children: React.ReactNode
  mode: Mode
  onModeChange: (mode: Mode) => void
  markdown: string
  onHeadingClick?: (id: string) => void
  currentHeadingId?: string
}

export const AppLayout = ({
  children,
  mode,
  onModeChange,
  markdown,
  onHeadingClick,
  currentHeadingId,
}: AppLayoutProps) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)

  const handleHeadingClick = (id: string) => {
    onHeadingClick?.(id)
    if (mode === "read") {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ModeToggle mode={mode} onModeChange={onModeChange} />

      <LeftSidebar
        isOpen={leftSidebarOpen}
        onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
        markdown={markdown}
        onHeadingClick={handleHeadingClick}
        currentHeadingId={currentHeadingId}
      />

      <main id="reader-scroll" className="reader-scrollbar fixed inset-0 overflow-y-auto z-30" style={{ paddingTop: "100px" }}>
        <div className="max-w-4xl mx-auto px-12 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <SettingsSidebar
        isOpen={rightSidebarOpen}
        onToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
      />
    </div>
  )
}
