import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LeftSidebar } from './LeftSidebar'
import { SettingsSidebar } from './SettingsSidebar'
import { ModeToggle } from '../mode/ModeToggle'
import type { MarkdownHistoryEntry } from '@/hooks/useLocalStorage'

type Mode = 'write' | 'read'

type AppLayoutProps = {
  children: React.ReactNode
  mode: Mode
  onModeChange: (mode: Mode) => void
  markdown: string
  historyEntries: MarkdownHistoryEntry[]
  selectedHistoryEntryId: string
  onHistoryEntrySelect: (id: string) => void
  onHistoryEntryDelete: (id: string) => void
  onHeadingClick?: (id: string) => void
  currentHeadingId?: string
}

export const AppLayout = ({
  children,
  mode,
  onModeChange,
  markdown,
  historyEntries,
  selectedHistoryEntryId,
  onHistoryEntrySelect,
  onHistoryEntryDelete,
  onHeadingClick,
  currentHeadingId,
}: AppLayoutProps) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const [modeToggleOpacity, setModeToggleOpacity] = useState(1)
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const fadeDistance = 120

    const updateModeToggleOpacity = () => {
      if (mode !== 'read') {
        setModeToggleOpacity(1)
        return
      }

      const nextOpacity = Math.max(0, 1 - scrollContainer.scrollTop / fadeDistance)
      setModeToggleOpacity(nextOpacity)
    }

    scrollContainer.addEventListener('scroll', updateModeToggleOpacity)
    updateModeToggleOpacity()

    return () => scrollContainer.removeEventListener('scroll', updateModeToggleOpacity)
  }, [mode])

  const handleHeadingClick = (id: string) => {
    onHeadingClick?.(id)
    if (mode === 'read') {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ModeToggle mode={mode} onModeChange={onModeChange} opacity={modeToggleOpacity} />

      <LeftSidebar
        isOpen={leftSidebarOpen}
        onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
        markdown={markdown}
        onHeadingClick={handleHeadingClick}
        currentHeadingId={currentHeadingId}
      />

      <main
        id="reader-scroll"
        ref={scrollContainerRef}
        className="reader-scrollbar fixed inset-0 overflow-y-auto z-30"
        style={{ paddingTop: '100px' }}
      >
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
        historyEntries={historyEntries}
        selectedHistoryEntryId={selectedHistoryEntryId}
        onHistoryEntrySelect={onHistoryEntrySelect}
        onHistoryEntryDelete={onHistoryEntryDelete}
      />
    </div>
  )
}
