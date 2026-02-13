import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useSettings } from "@/stores/settingsStore"
import { cn } from "@/lib/utils"

type MarkdownRendererProps = {
  content: string
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const { settings } = useSettings()

  return (
    <div
      className={cn(
        "prose prose-lg max-w-none",
        "prose-headings:font-semibold prose-headings:text-foreground",
        "prose-p:text-foreground prose-p:leading-relaxed",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-code:text-primary prose-code:bg-surface prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-pre:bg-surface prose-pre:border prose-pre:border-border",
        "prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic",
        "prose-ul:list-disc prose-ol:list-decimal",
        "prose-li:marker:text-primary",
        "prose-hr:border-border",
        "prose-img:rounded-lg prose-img:shadow-md"
      )}
      style={{
        fontSize: `${settings.fontSize}px`,
        lineHeight: `${settings.lineHeight}`,
        fontFamily: settings.fontFamily === "inter" ? "Inter, sans-serif" :
                   settings.fontFamily === "georgia" ? "Georgia, serif" :
                   settings.fontFamily === "jetbrains" ? "'JetBrains Mono', monospace" :
                   "system-ui, -apple-system, sans-serif",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => {
            const lineNumber = node?.position?.start.line ?? 0
            const id = `heading-${lineNumber}-${props.children
              ?.toString()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`
            return (
              <h1 id={id} className="scroll-mt-20" {...props} />
            )
          },
          h2: ({ node, ...props }) => {
            const lineNumber = node?.position?.start.line ?? 0
            const id = `heading-${lineNumber}-${props.children
              ?.toString()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`
            return (
              <h2 id={id} className="scroll-mt-20" {...props} />
            )
          },
          h3: ({ node, ...props }) => {
            const lineNumber = node?.position?.start.line ?? 0
            const id = `heading-${lineNumber}-${props.children
              ?.toString()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`
            return (
              <h3 id={id} className="scroll-mt-20" {...props} />
            )
          },
          h4: ({ node, ...props }) => {
            const lineNumber = node?.position?.start.line ?? 0
            const id = `heading-${lineNumber}-${props.children
              ?.toString()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`
            return (
              <h4 id={id} className="scroll-mt-20" {...props} />
            )
          },
          h5: ({ node, ...props }) => {
            const lineNumber = node?.position?.start.line ?? 0
            const id = `heading-${lineNumber}-${props.children
              ?.toString()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`
            return (
              <h5 id={id} className="scroll-mt-20" {...props} />
            )
          },
          h6: ({ node, ...props }) => {
            const lineNumber = node?.position?.start.line ?? 0
            const id = `heading-${lineNumber}-${props.children
              ?.toString()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`
            return (
              <h6 id={id} className="scroll-mt-20" {...props} />
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
