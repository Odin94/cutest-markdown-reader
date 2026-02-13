import { motion } from "framer-motion"
import { MarkdownRenderer } from "./MarkdownRenderer"

type ReadModeProps = {
  markdown: string
}

export const ReadMode = ({ markdown }: ReadModeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-[calc(100vh-120px)]"
    >
      <div className="bg-surface rounded-lg border border-border shadow-lg p-12 md:p-16 transition-shadow hover:shadow-xl">
        <MarkdownRenderer content={markdown} />
      </div>
    </motion.div>
  )
}
