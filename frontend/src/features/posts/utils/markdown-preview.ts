export function getMarkdownPreview(markdown: string) {
  return markdown
    .replace(/```[^\n]*\n?/g, " ")
    .replace(/```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*(?:>|[-+*]|\d+[.)])\s+/gm, "")
    .replace(/^\s*[-=_]{3,}\s*$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[\\`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
