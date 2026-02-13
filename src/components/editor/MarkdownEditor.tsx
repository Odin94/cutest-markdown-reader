import CodeMirror from "@uiw/react-codemirror"
import { markdown } from "@codemirror/lang-markdown"
import { oneDark } from "@codemirror/theme-one-dark"
import { useSettings } from "@/stores/settingsStore"

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
}

export const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const { settings } = useSettings()

  return (
    <div className="w-full h-full">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[markdown()]}
        theme={settings.theme === "dark" ? oneDark : undefined}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
        }}
        className="text-base"
        style={{
          fontSize: `${settings.fontSize}px !important`,
          lineHeight: `${settings.lineHeight} !important`,
        }}
      />
    </div>
  )
}
