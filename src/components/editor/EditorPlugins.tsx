import React from "react";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

const URL_MATCH =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCH.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith("http") ? fullMatch : `https://${fullMatch}`,
    };
  },
];

interface EditorPluginsProps {
  placeholder?: string;
  contentEditableClassName?: string;
  placeholderClassName?: string;
}

export const EditorPlugins: React.FC<EditorPluginsProps> = ({
  placeholder = "Write professional content here...",
  contentEditableClassName = "outline-none min-h-[350px] font-sans text-base text-[#141413] leading-relaxed",
  placeholderClassName = "absolute top-6 left-6 text-[#141413]/40 pointer-events-none font-sans text-base",
}) => {
  return (
    <>
      <RichTextPlugin
        contentEditable={<ContentEditable className={contentEditableClassName} />}
        placeholder={<div className={placeholderClassName}>{placeholder}</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
      <TablePlugin />
      <AutoLinkPlugin matchers={MATCHERS} />
      <MarkdownShortcutPlugin />
    </>
  );
};
