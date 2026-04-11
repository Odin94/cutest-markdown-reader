import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDebounce } from "./useDebounce"

const STORAGE_KEY = "cutest-markdown-history"
const LEGACY_STORAGE_KEY = "cutest-markdown-content"
const MAX_HISTORY_ENTRIES = 5
const COMPARE_DEBOUNCE_MS = 2500
const PERSIST_DEBOUNCE_MS = 500

const defaultMarkdown = `# Welcome to Cutest Markdown Reader

This is a beautiful, minimalist markdown reader designed for a delightful reading experience.

## Features

- **Write Mode**: Edit your markdown with syntax highlighting
- **Read Mode**: Enjoy a distraction-free reading experience
- **Document Outline**: Navigate through headings easily
- **Customizable**: Adjust themes, font sizes, and line heights

## Getting Started

Start typing or paste your markdown content here. Your content will be automatically saved to localStorage.

### Tips

- Use headings to create a document outline
- Switch between write and read modes for the best experience
- Customize your reading experience in the settings panel

Enjoy reading! ðŸ“šâœ¨
`

export type MarkdownHistoryEntry = {
  id: string
  title: string
  content: string
  updatedAt: number
}

type StoredHistory = {
  entries: MarkdownHistoryEntry[]
  selectedHistoryEntryId: string
}

type UseLocalStorageReturn = {
  markdown: string
  setMarkdown: (value: string) => void
  historyEntries: MarkdownHistoryEntry[]
  selectedHistoryEntryId: string
  selectHistoryEntry: (id: string) => void
  deleteHistoryEntry: (id: string) => void
}

const createId = () => {
  const randomPart = Math.random().toString(36).slice(2, 10)
  return `md-${Date.now()}-${randomPart}`
}

const getFirstMeaningfulLine = (content: string) => {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 0) ?? ""
}

const stripMarkdownDecorators = (line: string) => {
  return line
    .replace(/^#{1,6}\s+/, "")
    .replace(/^[>\-\*\+\d.)\s]+/, "")
    .replace(/[_*`~]+/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .trim()
}

const getHistoryTitle = (content: string) => {
  const headingMatch = content.match(/^#{1,6}\s+(.+)$/m)
  const rawTitle = headingMatch?.[1]?.trim() || stripMarkdownDecorators(getFirstMeaningfulLine(content))

  if (!rawTitle) {
    return "Untitled markdown"
  }

  return rawTitle.slice(0, 80)
}

const createEntry = (content: string, id = createId()): MarkdownHistoryEntry => ({
  id,
  title: getHistoryTitle(content),
  content,
  updatedAt: Date.now(),
})

const trimEntries = (entries: MarkdownHistoryEntry[]) => entries.slice(0, MAX_HISTORY_ENTRIES)
const moveEntryToFront = (entries: MarkdownHistoryEntry[], id: string) => {
  const selectedEntry = entries.find((entry) => entry.id === id)
  if (!selectedEntry) {
    return trimEntries(entries)
  }

  return trimEntries([
    selectedEntry,
    ...entries.filter((entry) => entry.id !== id),
  ])
}

const normalizeContent = (content: string) => content.replace(/\r\n/g, "\n")

const getChangeRatio = (previousContent: string, nextContent: string) => {
  const previous = normalizeContent(previousContent)
  const next = normalizeContent(nextContent)

  if (previous === next) {
    return 0
  }

  let prefixLength = 0
  const maxPrefix = Math.min(previous.length, next.length)
  while (prefixLength < maxPrefix && previous[prefixLength] === next[prefixLength]) {
    prefixLength += 1
  }

  let suffixLength = 0
  const maxSuffix = Math.min(previous.length - prefixLength, next.length - prefixLength)
  while (
    suffixLength < maxSuffix &&
    previous[previous.length - 1 - suffixLength] === next[next.length - 1 - suffixLength]
  ) {
    suffixLength += 1
  }

  const changedCharacters = previous.length + next.length - (prefixLength * 2) - (suffixLength * 2)
  return changedCharacters / Math.max(previous.length, next.length, 1)
}

const isVeryBigChange = (previousContent: string, nextContent: string) => {
  const changedCharacters = Math.abs(previousContent.length - nextContent.length)
    + Math.ceil(Math.max(previousContent.length, nextContent.length) * getChangeRatio(previousContent, nextContent))
  const changeRatio = getChangeRatio(previousContent, nextContent)

  return changedCharacters >= 400 && changeRatio >= 0.5
}

const loadStoredHistory = (): StoredHistory => {
  const defaultEntry = createEntry(defaultMarkdown)

  try {
    const storedHistory = window.localStorage.getItem(STORAGE_KEY)
    if (storedHistory) {
      const parsed = JSON.parse(storedHistory) as Partial<StoredHistory>
      if (Array.isArray(parsed.entries) && typeof parsed.selectedHistoryEntryId === "string") {
        const entries = parsed.entries
          .filter((entry): entry is MarkdownHistoryEntry => (
            typeof entry?.id === "string"
            && typeof entry?.content === "string"
            && typeof entry?.title === "string"
            && typeof entry?.updatedAt === "number"
          ))

        if (entries.length > 0) {
          const selectedExists = entries.some((entry) => entry.id === parsed.selectedHistoryEntryId)
          const nextSelectedHistoryEntryId = selectedExists ? parsed.selectedHistoryEntryId : entries[0].id

          return {
            entries: moveEntryToFront(entries, nextSelectedHistoryEntryId),
            selectedHistoryEntryId: nextSelectedHistoryEntryId,
          }
        }
      }
    }

    const legacyContent = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacyContent) {
      const migratedEntry = createEntry(legacyContent)
      return {
        entries: [migratedEntry],
        selectedHistoryEntryId: migratedEntry.id,
      }
    }
  } catch (error) {
    console.error("Error reading markdown history from localStorage:", error)
  }

  return {
    entries: [defaultEntry],
    selectedHistoryEntryId: defaultEntry.id,
  }
}

export const useLocalStorage = (): UseLocalStorageReturn => {
  const initialState = useRef(loadStoredHistory()).current
  const initialCurrentEntry = initialState.entries.find(
    (entry) => entry.id === initialState.selectedHistoryEntryId
  ) ?? initialState.entries[0]

  const [markdown, setMarkdownState] = useState(initialCurrentEntry.content)
  const [historyEntries, setHistoryEntries] = useState(initialState.entries)
  const [selectedHistoryEntryId, setSelectedHistoryEntryId] = useState(initialCurrentEntry.id)

  const markdownRef = useRef(markdown)
  const historyEntriesRef = useRef(historyEntries)
  const selectedHistoryEntryIdRef = useRef(selectedHistoryEntryId)
  const comparisonBaselineRef = useRef(initialCurrentEntry)

  const persistableData = useMemo(
    () => ({ historyEntries, selectedHistoryEntryId }),
    [historyEntries, selectedHistoryEntryId]
  )
  const persistableState = useDebounce(persistableData, PERSIST_DEBOUNCE_MS)
  const debouncedMarkdown = useDebounce(markdown, COMPARE_DEBOUNCE_MS)

  const syncState = useCallback((nextHistoryEntries: MarkdownHistoryEntry[], nextSelectedHistoryEntryId: string) => {
    historyEntriesRef.current = nextHistoryEntries
    selectedHistoryEntryIdRef.current = nextSelectedHistoryEntryId
    setHistoryEntries(nextHistoryEntries)
    setSelectedHistoryEntryId(nextSelectedHistoryEntryId)
  }, [])

  const commitDraft = useCallback((content: string) => {
    const baselineEntry = comparisonBaselineRef.current
    if (baselineEntry.content === content) {
      return
    }

    if (isVeryBigChange(baselineEntry.content, content)) {
      const nextEntry = createEntry(content)
      const restoredBaselineEntry = createEntry(baselineEntry.content, baselineEntry.id)
      restoredBaselineEntry.updatedAt = baselineEntry.updatedAt

      const nextHistoryEntries = trimEntries([
        nextEntry,
        restoredBaselineEntry,
        ...historyEntriesRef.current.filter((entry) => entry.id !== baselineEntry.id),
      ])

      comparisonBaselineRef.current = nextEntry
      syncState(nextHistoryEntries, nextEntry.id)
      return
    }

    const updatedEntry = createEntry(content, baselineEntry.id)
    const nextHistoryEntries = trimEntries([
      updatedEntry,
      ...historyEntriesRef.current.filter((entry) => entry.id !== baselineEntry.id),
    ])

    comparisonBaselineRef.current = updatedEntry
    syncState(nextHistoryEntries, updatedEntry.id)
  }, [syncState])

  const setMarkdown = useCallback((value: string) => {
    markdownRef.current = value
    setMarkdownState(value)

    const currentEntryId = selectedHistoryEntryIdRef.current
    const currentEntry = historyEntriesRef.current.find((entry) => entry.id === currentEntryId)
      ?? comparisonBaselineRef.current
    const previewEntry: MarkdownHistoryEntry = {
      ...currentEntry,
      title: getHistoryTitle(value),
      content: value,
      updatedAt: Date.now(),
    }

    const nextHistoryEntries = trimEntries([
      previewEntry,
      ...historyEntriesRef.current.filter((entry) => entry.id !== currentEntryId),
    ])

    historyEntriesRef.current = nextHistoryEntries
    setHistoryEntries(nextHistoryEntries)
  }, [])

  const selectHistoryEntry = useCallback((id: string) => {
    commitDraft(markdownRef.current)

    const selectedEntry = historyEntriesRef.current.find((entry) => entry.id === id)
    if (!selectedEntry) {
      return
    }

    const nextHistoryEntries = trimEntries([
      selectedEntry,
      ...historyEntriesRef.current.filter((entry) => entry.id !== id),
    ])

    comparisonBaselineRef.current = selectedEntry
    markdownRef.current = selectedEntry.content
    setMarkdownState(selectedEntry.content)
    syncState(nextHistoryEntries, selectedEntry.id)
  }, [commitDraft, syncState])

  const deleteHistoryEntry = useCallback((id: string) => {
    if (id === selectedHistoryEntryIdRef.current) {
      return
    }

    const nextHistoryEntries = historyEntriesRef.current.filter((entry) => entry.id !== id)
    if (nextHistoryEntries.length === historyEntriesRef.current.length) {
      return
    }

    syncState(nextHistoryEntries, selectedHistoryEntryIdRef.current)
  }, [syncState])

  useEffect(() => {
    markdownRef.current = markdown
  }, [markdown])

  useEffect(() => {
    commitDraft(debouncedMarkdown)
  }, [commitDraft, debouncedMarkdown])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          entries: persistableState.historyEntries,
          selectedHistoryEntryId: persistableState.selectedHistoryEntryId,
        } satisfies StoredHistory)
      )
    } catch (error) {
      console.error("Error writing markdown history to localStorage:", error)
    }
  }, [persistableState])

  return {
    markdown,
    setMarkdown,
    historyEntries,
    selectedHistoryEntryId,
    selectHistoryEntry,
    deleteHistoryEntry,
  }
}
