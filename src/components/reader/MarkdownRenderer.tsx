import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import mermaid from "mermaid"
import { Copy, Check } from "lucide-react"
import { useSettings } from "@/stores/settingsStore"
import { cn } from "@/lib/utils"

type MarkdownRendererProps = {
  content: string
}

let mermaidInitialized = false

const MermaidDiagram = ({ 
  code 
}: { 
  code: string 
}) => {
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const { settings } = useSettings()
  const isDark = settings.theme === "dark"

  useEffect(() => {
    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
    let cancelled = false

    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
        securityLevel: "loose",
      })
      mermaidInitialized = true
    } else {
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
        securityLevel: "loose",
      })
    }

    setError(null)
    setSvg("")

    mermaid
      .render(id, code)
      .then((result) => {
        if (!cancelled) {
          setSvg(result.svg)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to render diagram")
          setSvg("")
        }
      })

    return () => {
      cancelled = true
    }
  }, [code, isDark])

  if (error) {
    return (
      <div className="my-4 p-4 rounded-md bg-destructive/10 border border-destructive/20">
        <p className="text-destructive text-sm">Mermaid diagram error: {error}</p>
        <pre className="mt-2 text-xs text-foreground/70">{code}</pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="my-4 flex justify-center bg-surface rounded-md p-4">
        <div className="text-foreground/50 text-sm">Loading diagram...</div>
      </div>
    )
  }

  return (
    <div 
      key={`mermaid-${code.slice(0, 20)}`}
      className="my-4 flex justify-center bg-surface rounded-md p-4 overflow-x-auto"
    >
      <div key={`mermaid-svg-${code.slice(0, 20)}`} dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  )
}

const CodeBlock = ({ 
  language, 
  children 
}: { 
  language?: string
  children?: React.ReactNode 
}) => {
  const [copied, setCopied] = useState(false)
  const codeString = String(children).replace(/\n$/, "")
  const { settings } = useSettings()
  const isDark = settings.theme === "dark"

  if (language === "mermaid") {
    return <MermaidDiagram code={codeString} />
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-4">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-md bg-surface/90 backdrop-blur-sm border border-border hover:bg-accent transition-all opacity-100 group-hover:opacity-100 shadow-sm"
        aria-label="Copy code"
        title="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-primary" />
        ) : (
          <Copy className="h-4 w-4 text-foreground" />
        )}
      </button>
      <SyntaxHighlighter
        language={language || "text"}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: "0.5rem",
          fontSize: `${settings.fontSize * 0.9}px`,
          lineHeight: `${settings.lineHeight}`,
          padding: "1rem",
          background: isDark ? "#2D2D2D" : "#FAF7F2",
        }}
        PreTag="div"
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  )
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const { settings } = useSettings()

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:font-semibold prose-headings:text-foreground",
        "prose-p:text-foreground",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-code:text-primary prose-code:bg-surface prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-0",
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
          code: (props) => {
            const { node: _node, inline, className, children, ...rest } = props as {
              node?: unknown
              inline?: boolean
              className?: string
              children?: React.ReactNode
            }
            
            const codeString = String(children).replace(/\n$/, "")
            const hasLanguage = className && /language-/.test(className)
            const isMultiline = codeString.includes("\n")
            
            if (inline || (!hasLanguage && !isMultiline)) {
              const extractText = (node: React.ReactNode): string => {
                if (typeof node === "string") {
                  return node.replace(/^`+|`+$/g, "")
                }
                if (typeof node === "number") {
                  return String(node)
                }
                if (Array.isArray(node)) {
                  return node.map(extractText).join("")
                }
                if (node && typeof node === "object" && "props" in node) {
                  return extractText((node as { props?: { children?: React.ReactNode } }).props?.children)
                }
                return String(node).replace(/^`+|`+$/g, "")
              }
              const textContent = extractText(children)
              return (
                <code
                  className="text-primary bg-surface px-1 py-0.5 rounded text-sm font-mono"
                  {...rest}
                >
                  {textContent}
                </code>
              )
            }
            const match = /language-(\w+)/.exec(className || "")
            const language = match ? match[1] : ""
            return (
              <CodeBlock key={`code-${language}-${codeString.slice(0, 20)}`} language={language}>
                {children}
              </CodeBlock>
            )
          },
          pre: ({ children }) => {
            return <div>{children}</div>
          },
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
