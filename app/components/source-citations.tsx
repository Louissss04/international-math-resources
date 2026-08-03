import type { SourceRecord } from "../lib/types";

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
          {source.id}
        </a>
      ))}
    </span>
  );
}

