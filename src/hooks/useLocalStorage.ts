import { useState, useEffect } from "react"
import { useDebounce } from "./useDebounce"

const STORAGE_KEY = "cutest-markdown-content"

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

Enjoy reading! 📚✨
`

type UseLocalStorageReturn = [string, (value: string) => void]

export const useLocalStorage = (): UseLocalStorageReturn => {
  const [value, setValue] = useState<string>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY)
      return item ?? defaultMarkdown
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return defaultMarkdown
    }
  })

  const debouncedValue = useDebounce(value, 500)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, debouncedValue)
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }
  }, [debouncedValue])

  return [value, setValue]
}
