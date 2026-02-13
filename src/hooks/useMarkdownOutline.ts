import { useMemo } from "react"

export type Heading = {
  id: string
  level: number
  text: string
}

export const useMarkdownOutline = (markdown: string): Heading[] => {
  return useMemo(() => {
    const headings: Heading[] = []
    const lines = markdown.split("\n")

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      
      if (trimmed.startsWith("#")) {
        const match = trimmed.match(/^(#{1,6})\s+(.+)$/)
        if (match) {
          const level = match[1].length
          const text = match[2]
          const lineNumber = index + 1
          const id = `heading-${lineNumber}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
          headings.push({ id, level, text })
        }
      }
    })

    return headings
  }, [markdown])
}
