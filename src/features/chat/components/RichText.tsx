import { Fragment } from "react";

/** Renders **bold** inside a line of text without using innerHTML. */
function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Minimal, safe Markdown subset used by the assistant: paragraphs, bullet lists and bold. */
export function RichText({ text }: { text: string }) {
  const blocks: { type: "p" | "ul"; lines: string[] }[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const last = blocks.at(-1);
    if (bullet) {
      if (last?.type === "ul") last.lines.push(bullet[1]);
      else blocks.push({ type: "ul", lines: [bullet[1]] });
    } else {
      blocks.push({ type: "p", lines: [line] });
    }
  }

  return (
    <div className="space-y-2 leading-relaxed">
      {blocks.map((block, i) =>
        block.type === "ul" ? (
          <ul key={i} className="list-disc space-y-1 pl-5">
            {block.lines.map((line, j) => (
              <li key={j}>
                <InlineText text={line} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            <InlineText text={block.lines[0]} />
          </p>
        ),
      )}
    </div>
  );
}
