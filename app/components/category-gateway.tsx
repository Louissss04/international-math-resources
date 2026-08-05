import Link from "next/link";
import type { LocalizedText, Track } from "../lib/types";
import { Breadcrumbs } from "./breadcrumbs";
import { Localized } from "./localized";

export type CategoryGatewayItem = {
  track: Extract<Track, "competition" | "curriculum" | "assessment">;
  href: string;
  title: LocalizedText;
  description: LocalizedText;
  count: number;
};

export function CategoryGateway({
  title,
  description,
  items,
}: {
  title: LocalizedText;
  description: LocalizedText;
  items: CategoryGatewayItem[];
}) {
  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: title }]} />
        <div className="page-title-row"><div><h1><Localized text={title} /></h1><p><Localized text={description} /></p></div></div>
      </header>
      <section className="page-container directory-section category-gateway-grid">
        {items.map((item) => (
          <Link className={`category-gateway-card category-gateway-${item.track}`} href={item.href} key={item.track}>
            <b>{item.count}</b>
            <h2><Localized text={item.title} /></h2>
            <p><Localized text={item.description} /></p>
            <span><span className="lang-zh">进入</span><span className="lang-en">Open</span></span>
          </Link>
        ))}
      </section>
    </main>
  );
}
