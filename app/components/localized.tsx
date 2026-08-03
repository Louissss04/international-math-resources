import type { ElementType, ReactNode } from "react";
import type { LocalizedText } from "../lib/types";

export function Localized({ text }: { text: LocalizedText }) {
  return (
    <>
      <span className="lang-zh">{text.zh}</span>
      <span className="lang-en">{text.en}</span>
    </>
  );
}

export function LocalizedBlock({
  as: Tag = "p",
  text,
  className,
  children,
}: {
  as?: ElementType;
  text: LocalizedText;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Tag className={className}>
      <Localized text={text} />
      {children}
    </Tag>
  );
}

