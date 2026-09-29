import React, { useRef, useState, useEffect, useMemo, memo } from "react";
import { Jodit } from "jodit";
import "jodit/es2021/jodit.min.css";
import { convertMarkdownToHtml } from "../../lib/markdownHelper";
import { Sparkles, Check } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

const RichTextEditorComponent: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write professional article content here (paste from Word, Google Docs, or Markdown)...",
  height = 420,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorInstanceRef = useRef<any>(null);
  const isFocusedRef = useRef(false);
  const internalValueRef = useRef(value || "");
  const [formattedSuccess, setFormattedSuccess] = useState(false);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Memoize stable configuration object to avoid any recreations
  const config = useMemo(() => {
    return {
      readonly: false,
      placeholder: placeholder || "Start typing or paste formatted text / Markdown...",
      height: height,
      minHeight: 320,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_as_html",
      processPasteHTML: true,
      toolbarAdaptive: false,
      toolbarSticky: false,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      editorCssClass: "rich-theme-content",
      style: {
        background: "#FFFFFF",
        color: "#141413",
        fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: "16px",
        lineHeight: "1.75",
        padding: "20px",
      },
      buttons: [
        "paragraph",
        "fontsize",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "brush",
        "align",
        "|",
        "link",
        "image",
        "table",
        "hr",
        "|",
        "undo",
        "redo",
        "source",
        "fullsize",
      ],
      controls: {
        paragraph: {
          list: {
            p: "Normal Paragraph",
            h1: "Heading 1 (Main Title)",
            h2: "Heading 2 (Section)",
            h3: "Heading 3 (Sub-heading)",
            h4: "Heading 4 (Minor)",
            blockquote: "Quote Box",
            pre: "Code Block",
          },
        },
      },
      uploader: {
        insertImageAsBase64URI: true,
      },
    };
  }, [placeholder, height]);

  // Initialize Jodit instance once and attach event listeners
  useEffect(() => {
    if (!textareaRef.current) return;

    let debounceTimer: any = null;

    const editor = Jodit.make(textareaRef.current, config as any);
    editorInstanceRef.current = editor;

    // Set initial content
    editor.value = internalValueRef.current || "";

    // Track focus states to prevent controlled override while user is typing
    editor.events.on("focus", () => {
      isFocusedRef.current = true;
    });

    editor.events.on("blur", () => {
      isFocusedRef.current = false;
      const currentVal = editor.value;
      internalValueRef.current = currentVal;
      onChangeRef.current(currentVal);
    });

    // Handle typing smoothly without recreating instance or resetting cursor
    editor.events.on("change", () => {
      const currentVal = editor.value;
      internalValueRef.current = currentVal;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        onChangeRef.current(currentVal);
      }, 200);
    });

    // Handle smart markdown paste
    editor.events.on("beforePaste", (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      const html = clipboardData.getData("text/html");
      const text = clipboardData.getData("text/plain");

      // If rich HTML is present from Google Docs, Word, or Web, let Jodit handle natively
      if (html && html.trim().length > 0) {
        return;
      }

      // If plain text contains Markdown syntax, convert to clean HTML
      if (
        text &&
        (text.includes("#") ||
          text.includes("**") ||
          text.includes("- ") ||
          text.includes("* ") ||
          text.includes("> ") ||
          text.includes("```") ||
          text.includes("http://") ||
          text.includes("https://") ||
          text.includes("\n\n"))
      ) {
        const converted = convertMarkdownToHtml(text);
        if (converted && converted !== text) {
          event.preventDefault();
          if (editor.s?.insertHTML) {
            editor.s.insertHTML(converted);
          } else if (editor.selection?.insertHTML) {
            editor.selection.insertHTML(converted);
          } else {
            editor.value = (editor.value || "") + converted;
          }
        }
      }
    });

    return () => {
      clearTimeout(debounceTimer);
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.destruct();
        } catch (e) {
          // safe ignore
        }
        editorInstanceRef.current = null;
      }
    };
  }, [config]);

  // Sync external value updates (e.g. post selection, draft restore, form reset)
  // CRITICAL: NEVER overwrite editor while user is actively editing/focused!
  useEffect(() => {
    if (
      editorInstanceRef.current &&
      value !== undefined &&
      value !== internalValueRef.current &&
      !isFocusedRef.current
    ) {
      internalValueRef.current = value;
      editorInstanceRef.current.value = value;
    }
  }, [value]);

  // Quick Action: Convert current content to rich formatted HTML
  const handleAutoFormat = () => {
    if (!editorInstanceRef.current) return;
    const currentText = editorInstanceRef.current.value || value;
    if (!currentText || !currentText.trim()) return;

    const formatted = convertMarkdownToHtml(currentText);
    editorInstanceRef.current.value = formatted;
    internalValueRef.current = formatted;
    onChangeRef.current(formatted);

    setFormattedSuccess(true);
    setTimeout(() => setFormattedSuccess(false), 2500);
  };

  return (
    <div className="space-y-2">
      {/* Editor Helper Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#FAF8F2] border border-[#141413]/15 text-xs font-mono text-[#6B6862]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="font-semibold text-[#141413]">Live WYSIWYG Formatted View</span>
          <span className="hidden sm:inline text-[#9E9A91]">| Paste from Word, Docs, Web or Markdown</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoFormat}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#141413]/20 hover:border-[#141413] hover:bg-[#D4F050] text-[#141413] font-bold text-[11px] transition-all cursor-pointer shadow-xs active:scale-95"
            title="Convert any raw markdown or text into styled headings, bold text, and lists"
          >
            {formattedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Formatted!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#141413]" />
                <span>Format Text / Markdown</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Persistent Stable Editor Container */}
      <div className="bg-white border-2 border-[#141413] rounded-2xl overflow-hidden shadow-[4px_4px_0px_#141413]">
        <textarea ref={textareaRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export const RichTextEditor = memo(RichTextEditorComponent);
