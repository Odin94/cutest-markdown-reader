import { motion } from "framer-motion"
import { MarkdownEditor } from "./MarkdownEditor"

type WriteModeProps = {
  markdown: string
  onMarkdownChange: (value: string) => void
}

export const WriteMode = ({ markdown, onMarkdownChange }: WriteModeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-[calc(100vh-120px)]"
    >
      <div className="bg-surface rounded-lg border border-border shadow-lg overflow-hidden p-4 transition-shadow hover:shadow-xl">
        <MarkdownEditor value={markdown} onChange={onMarkdownChange} />
      </div>
    </motion.div>
  )
}
