"use client";

import {
  Bold,
  Code2,
  Eye,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  PencilLine,
  Quote,
} from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MarkdownContent } from "./markdown-content";

type MobileView = "write" | "preview";

interface MarkdownEditorProps {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  inputRef?: (element: HTMLTextAreaElement | null) => void;
}

interface ToolbarButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({ label, onClick, children }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="text-slate-500 hover:text-slate-950"
    >
      {children}
    </Button>
  );
}

export function MarkdownEditor({
  id,
  name,
  value,
  placeholder,
  disabled,
  ariaInvalid,
  ariaDescribedBy,
  onChange,
  onBlur,
  inputRef,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>("write");

  const setValueAndSelection = (
    nextValue: string,
    selectionStart: number,
    selectionEnd = selectionStart,
  ) => {
    onChange(nextValue);

    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const wrapSelection = (
    before: string,
    after: string,
    placeholderText: string,
  ) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const selection = value.slice(start, end) || placeholderText;
    const nextValue = `${value.slice(0, start)}${before}${selection}${after}${value.slice(end)}`;
    const nextStart = start + before.length;

    setValueAndSelection(
      nextValue,
      nextStart,
      nextStart + selection.length,
    );
  };

  const prefixSelectedLines = (
    getPrefix: (index: number) => string,
    placeholderText: string,
  ) => {
    const textarea = textareaRef.current;
    const selectionStart = textarea?.selectionStart ?? value.length;
    const selectionEnd = textarea?.selectionEnd ?? value.length;
    const blockStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const nextLineBreak = value.indexOf("\n", selectionEnd);
    const blockEnd = nextLineBreak === -1 ? value.length : nextLineBreak;
    const selectedBlock = value.slice(blockStart, blockEnd) || placeholderText;
    const formattedBlock = selectedBlock
      .split("\n")
      .map((line, index) => `${getPrefix(index)}${line || placeholderText}`)
      .join("\n");
    const nextValue = `${value.slice(0, blockStart)}${formattedBlock}${value.slice(blockEnd)}`;

    setValueAndSelection(
      nextValue,
      blockStart,
      blockStart + formattedBlock.length,
    );
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-white",
        ariaInvalid
          ? "border-destructive ring-3 ring-destructive/15"
          : "border-slate-200",
      )}
    >
      <fieldset
        disabled={disabled}
        className="flex min-h-10 items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-2 disabled:opacity-60"
      >
        <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto py-1">
          <ToolbarButton
            label="Bold"
            onClick={() => wrapSelection("**", "**", "bold text")}
          >
            <Bold />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            onClick={() => wrapSelection("_", "_", "italic text")}
          >
            <Italic />
          </ToolbarButton>
          <span className="mx-1 h-5 w-px shrink-0 bg-slate-200" />
          <ToolbarButton
            label="Heading"
            onClick={() => prefixSelectedLines(() => "## ", "Heading")}
          >
            <Heading2 />
          </ToolbarButton>
          <ToolbarButton
            label="Quote"
            onClick={() => prefixSelectedLines(() => "> ", "Quote")}
          >
            <Quote />
          </ToolbarButton>
          <ToolbarButton
            label="Bulleted list"
            onClick={() => prefixSelectedLines(() => "- ", "List item")}
          >
            <List />
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            onClick={() =>
              prefixSelectedLines((index) => `${index + 1}. `, "List item")
            }
          >
            <ListOrdered />
          </ToolbarButton>
          <span className="mx-1 h-5 w-px shrink-0 bg-slate-200" />
          <ToolbarButton
            label="Link"
            onClick={() =>
              wrapSelection("[", "](https://example.com)", "link text")
            }
          >
            <Link2 />
          </ToolbarButton>
          <ToolbarButton
            label="Inline code"
            onClick={() => wrapSelection("`", "`", "code")}
          >
            <Code2 />
          </ToolbarButton>
        </div>

        <div className="flex shrink-0 items-center rounded-lg border border-slate-200 bg-white p-0.5 md:hidden">
          <Button
            type="button"
            variant={mobileView === "write" ? "secondary" : "ghost"}
            size="xs"
            onClick={() => setMobileView("write")}
          >
            <PencilLine />
            Write
          </Button>
          <Button
            type="button"
            variant={mobileView === "preview" ? "secondary" : "ghost"}
            size="xs"
            onClick={() => setMobileView("preview")}
          >
            <Eye />
            Preview
          </Button>
        </div>
      </fieldset>

      <div className="grid md:grid-cols-2 md:divide-x md:divide-slate-100">
        <div className={mobileView === "write" ? "block" : "hidden md:block"}>
          <div className="hidden h-9 items-center border-b border-slate-100 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:flex">
            Markdown
          </div>
          <Textarea
            id={id}
            name={name}
            ref={(element) => {
              textareaRef.current = element;
              inputRef?.(element);
            }}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            spellCheck
            className="h-[28rem] min-h-[28rem] resize-none rounded-none border-0 px-4 py-3 font-mono text-sm leading-6 [field-sizing:fixed] focus-visible:border-transparent focus-visible:ring-0"
          />
        </div>

        <div
          className={
            mobileView === "preview" ? "block" : "hidden md:block"
          }
        >
          <div className="hidden h-9 items-center border-b border-slate-100 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:flex">
            Live preview
          </div>
          <div className="h-[28rem] overflow-y-auto bg-slate-50/35 px-5 py-4">
            {value.trim() ? (
              <MarkdownContent
                content={value}
                className="prose-sm leading-relaxed"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <Eye className="mx-auto size-5 text-slate-300" />
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Nothing to preview yet
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Start writing to see the article here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
