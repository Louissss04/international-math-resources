import type { InformationStatus } from "../lib/types";

const labels: Record<InformationStatus, { zh: string; en: string }> = {
  confirmed: { zh: "已确认", en: "Confirmed" },
  historical: { zh: "历史记录", en: "Historical" },
  pending: { zh: "待公布", en: "Pending" },
  conflict: { zh: "来源冲突", en: "Source conflict" },
};

export function StatusBadge({ status }: { status: InformationStatus }) {
  return (
    <span className={`status-badge status-${status}`}>
      <span className="lang-zh">{labels[status].zh}</span>
      <span className="lang-en">{labels[status].en}</span>
    </span>
  );
}

