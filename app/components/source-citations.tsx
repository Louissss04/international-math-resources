import type { SourceRecord } from "../lib/types";

const kindLabels = {
  official: { zh: "官网", en: "Official" },
  "official-data": { zh: "数据", en: "Data" },
  "official-archive": { zh: "档案", en: "Archive" },
  "secondary-archive": { zh: "汇编", en: "Secondary" },
} as const;

export function SourceCitations({ ids, sources }: { ids?: string[]; sources: SourceRecord[] }) {
  if (!ids?.length) return null;
  const records = ids
    .map((id) => sources.find((source) => source.id === id))
    .filter((source): source is SourceRecord => Boolean(source));
  if (!records.length) return null;

  return (
    <span className="source-citations" aria-label="Sources">
      {records.map((source) => (
        <a key={source.id} href={source.url} target="_blank" rel="noreferrer" title={source.label.en}>
          <span className="lang-zh">{kindLabels[source.kind].zh}</span>
          <span className="lang-en">{kindLabels[source.kind].en}</span>
        </a>
      ))}
    </span>
  );
}
