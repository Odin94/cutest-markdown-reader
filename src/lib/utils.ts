import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

const WORDS_PER_MINUTE = 200

export const getReadingTimeMinutes = (markdown: string): number => {
  const noCodeBlocks = markdown.replace(/```[\s\S]*?```/g, " ")
  const noInlineCode = noCodeBlocks.replace(/`[^`]+`/g, " ")
  const linkTextOnly = noInlineCode.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1 ")
  const noImages = linkTextOnly.replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
  const noHeaders = noImages.replace(/^#+\s+/gm, " ")
  const noEmphasis = noHeaders.replace(/\*+|\_+/g, " ")
  const noListMarkers = noEmphasis.replace(/^\s*[-*+]\s+|^\s*\d+\.\s+/gm, " ")
  const words = noListMarkers.split(/\s+/).filter((w) => w.length > 0)
  return Math.ceil(words.length / WORDS_PER_MINUTE)
}
