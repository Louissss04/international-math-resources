"use client";

import { useSyncExternalStore } from "react";
import type { ProjectRecord } from "../lib/types";

const storageKey = "mathpath-planner-v2";

type PlannedItem = {
  profileId?: string;
  projectId: string;
  titleZh: string;
  titleEn: string;
  track: string;
  deadline?: string;
  status: "researching" | "preparing" | "submitted" | "complete";
  updatedAt: string;
};

function readItems(): PlannedItem[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { items?: PlannedItem[] };
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

function subscribeToPlanner(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("mathpath-planner-updated", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("mathpath-planner-updated", onStoreChange);
  };
}

export function AddToPlan({ project }: { project: ProjectRecord }) {
  const saved = useSyncExternalStore(
    subscribeToPlanner,
    () => readItems().some((item) => item.projectId === project.id),
    () => false,
  );

  function add() {
    const items = readItems();
    if (items.some((item) => item.projectId === project.id)) {
      window.dispatchEvent(new CustomEvent("mathpath-planner-updated"));
      return;
    }
    const next: PlannedItem = {
      profileId: (() => {
        try {
          const raw = window.localStorage.getItem(storageKey);
          if (!raw) return "default";
          const parsed = JSON.parse(raw) as { activeProfileId?: string };
          return parsed.activeProfileId || "default";
        } catch { return "default"; }
      })(),
      projectId: project.id,
      titleZh: project.title.zh,
      titleEn: project.title.en,
      track: project.track,
      deadline: project.dates
        .filter((item) => item.status === "confirmed" && item.date >= new Date().toISOString().slice(0, 10))
        .sort((a, b) => a.date.localeCompare(b.date))[0]?.date,
      status: "researching",
      updatedAt: new Date().toISOString(),
    };
    let existing: Record<string, unknown> = {};
    try { existing = JSON.parse(window.localStorage.getItem(storageKey) || "{}"); } catch { existing = {}; }
    window.localStorage.setItem(storageKey, JSON.stringify({ ...existing, schemaVersion: 2, items: [...items, next] }));
    window.dispatchEvent(new CustomEvent("mathpath-planner-updated"));
  }

  return (
    <button className="primary-button" type="button" onClick={add} disabled={saved}>
      <span className="lang-zh">{saved ? "已加入规划器" : "加入规划器"}</span>
      <span className="lang-en">{saved ? "Added to planner" : "Add to planner"}</span>
    </button>
  );
}
