import Link from "next/link";
import type { LocalizedText } from "../lib/types";
import { Localized } from "./localized";

export function Breadcrumbs({ items }: { items: Array<{ label: LocalizedText; href?: string }> }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/"><span className="lang-zh">首页</span><span className="lang-en">Home</span></Link>
      {items.map((item, index) => (
        <span key={`${item.label.en}-${index}`}>
          <i aria-hidden="true">/</i>
          {item.href ? <Link href={item.href}><Localized text={item.label} /></Link> : <b><Localized text={item.label} /></b>}
        </span>
      ))}
    </nav>
  );
}

