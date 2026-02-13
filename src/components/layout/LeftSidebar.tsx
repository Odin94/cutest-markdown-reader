import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, List, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMarkdownOutline, type Heading } from "@/hooks/useMarkdownOutline"
import { cn } from "@/lib/utils"

type LeftSidebarProps = {
  isOpen: boolean
  onToggle: () => void
  markdown: string
  onHeadingClick: (id: string) => void
  currentHeadingId?: string
}

export const LeftSidebar = ({
  isOpen,
  onToggle,
  markdown,
  onHeadingClick,
  currentHeadingId,
}: LeftSidebarProps) => {
  const headings = useMarkdownOutline(markdown)
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

  const renderHeading = (heading: Heading) => {
    const isActive = heading.id === currentHeadingId
    const indent = heading.level - 1

    return (
      <motion.button
        key={heading.id}
        onClick={() => onHeadingClick(heading.id)}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "w-full text-left rounded-md transition-colors hover:bg-accent/50 leading-relaxed",
          isActive ? "bg-accent/30 text-primary font-medium" : "text-foreground/80"
        )}
        style={{ paddingLeft: `${1.5 + indent * 1.5}rem` }}
      >
        <span className="text-sm leading-relaxed">{heading.text}</span>
      </motion.button>
    )
  }

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            key="left-sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-64 bg-surface/95 backdrop-blur-md border-r border-border shadow-xl z-40 flex flex-col"
          >
            <div className="flex items-center justify-start p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div
              ref={scrollContainerRef}
              className={cn(
                "flex-1 overflow-y-auto px-2 outline-scrollbar",
                isScrolling && "scrolling"
              )}
              style={{ scrollbarGutter: "stable" }}
            >
              {headings.length === 0 ? (
                <p className="text-sm text-muted-foreground px-4 py-8 text-center leading-relaxed">
                  No headings found. Add some headings to your markdown to see the outline here.
                </p>
              ) : (
                <div className="space-y-2">
                  {headings.map((heading) => renderHeading(heading))}
                </div>
              )}
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
      {!isOpen ? (
        <motion.button
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed left-4 top-20 z-40 h-10 w-10 rounded-full bg-surface/90 backdrop-blur-md border border-border shadow-lg flex items-center justify-center hover:bg-accent/50 transition-colors"
          aria-label="Open document outline"
        >
          <List className="h-5 w-5" />
        </motion.button>
      ) : null}
    </>
  )
}
