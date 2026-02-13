import { useState, useEffect } from "react"
import { SettingsProvider } from "./stores/settingsStore"
import { AppLayout } from "./components/layout/AppLayout"
import { WriteMode } from "./components/editor/WriteMode"
import { ReadMode } from "./components/reader/ReadMode"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { useMarkdownOutline } from "./hooks/useMarkdownOutline"

type Mode = "write" | "read"

const App = () => {
  const [mode, setMode] = useState<Mode>("read")
  const [markdown, setMarkdown] = useLocalStorage()
  const [currentHeadingId, setCurrentHeadingId] = useState<string | undefined>()
  const headings = useMarkdownOutline(markdown)

  useEffect(() => {
    const scrollContainer = document.getElementById("reader-scroll")
    if (!scrollContainer) return

    const handleScroll = () => {
      if (mode !== "read") return

      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter((el) => el !== null) as HTMLElement[]

      if (headingElements.length === 0) return

      const mainRect = scrollContainer.getBoundingClientRect()
      const topOffset = mainRect.top + 120

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const rect = headingElements[i].getBoundingClientRect()
        if (rect.top <= topOffset) {
          setCurrentHeadingId(headings[i].id)
          return
        }
      }
      setCurrentHeadingId(undefined)
    }

    scrollContainer.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => scrollContainer.removeEventListener("scroll", handleScroll)
  }, [mode, headings])

  const handleHeadingClick = (id: string) => {
    setCurrentHeadingId(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault()
        setMode((prev) => (prev === "write" ? "read" : "write"))
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  return (
    <SettingsProvider>
      <AppLayout
        mode={mode}
        onModeChange={setMode}
        markdown={markdown}
        onHeadingClick={handleHeadingClick}
        currentHeadingId={currentHeadingId}
      >
        {mode === "write" ? (
          <WriteMode markdown={markdown} onMarkdownChange={setMarkdown} />
        ) : (
          <ReadMode markdown={markdown} />
        )}
      </AppLayout>
    </SettingsProvider>
  )
}

export default App
