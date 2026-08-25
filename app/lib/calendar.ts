import type { DateRecord, ProjectRecord } from "./types";

export const CALENDAR_START_DATE = "2026-01-01";
const ISO_CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function calendarDateInRange(record: DateRecord): boolean {
  return ISO_CALENDAR_DATE.test(record.date) && record.date >= CALENDAR_START_DATE;
}

export function calendarDateIsHistorical(record: DateRecord, today: string): boolean {
  const effectiveDate = record.endDate ?? record.date;
  return ISO_CALENDAR_DATE.test(effectiveDate) && effectiveDate < today;
}

export function calendarDateCount(projects: ProjectRecord[]): number {
  return projects.reduce(
    (total, project) => total + project.dates.filter(calendarDateInRange).length,
    0,
  );
}

export function localDateString(value = new Date()): string {
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
