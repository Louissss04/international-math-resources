import { t, type LocalizedText, type Track } from "./types";

export const trackOrder: Track[] = ["competition", "modeling", "research", "summer", "curriculum", "assessment"];

const trackLabels: Record<Track, LocalizedText> = {
  competition: t("数学竞赛", "Mathematics competitions"),
  modeling: t("数学建模", "Mathematical modeling"),
  research: t("数学科研", "Mathematics research"),
  summer: t("数学夏校与夏令营", "Mathematics summer programs"),
  curriculum: t("数学课程与统考", "Mathematics curricula and subject exams"),
  assessment: t("数学入学考试与定量测评", "Mathematics admissions tests and quantitative assessments"),
};

const gradeLabels: Record<string, LocalizedText> = {
  "Australian Years 3–12 globally": t("全球赛区澳大利亚学制 3—12 年级", "Australian Years 3–12 globally"),
  "CÉGEP": t("魁北克 CÉGEP", "CÉGEP"),
  "China route: Grade 10 or below": t("中国赛区十年级及以下", "China route: Grade 10 or below"),
  "China route: Grade 7 or below": t("中国赛区七年级及以下", "China route: Grade 7 or below"),
  elementary: t("小学", "Elementary school"),
  "Grade 8 or below": t("八年级及以下", "Grade 8 or below"),
  "Grade 9 or below": t("九年级及以下", "Grade 9 or below"),
  "Grade 10 or below": t("十年级及以下", "Grade 10 or below"),
  "Grade 11 or below": t("十一年级及以下", "Grade 11 or below"),
  "Grade 12 or below": t("十二年级及以下", "Grade 12 or below"),
  "Grade 7": t("七年级", "Grade 7"),
  "Grade 8": t("八年级", "Grade 8"),
  "Grade 11": t("十一年级", "Grade 11"),
  "Grade 12": t("十二年级", "Grade 12"),
  "Grades 1–12": t("一至十二年级", "Grades 1–12"),
  "Grades 1–12 in China": t("中国赛区一至十二年级", "Grades 1–12 in China"),
  "Final year of secondary school": t("中学毕业年级", "Final year of secondary school"),
  "Year 13 or below": t("Year 13 及以下", "Year 13 or below"),
  "Northern Ireland Year 14 or below": t("北爱尔兰 Year 14 及以下", "Northern Ireland Year 14 or below"),
  "S6 or below": t("苏格兰 S6 及以下", "S6 or below"),
  "Younger students permitted": t("低年级也可参加", "Younger students permitted"),
  "High school": t("高中", "High school"),
  "Secondary school": t("中学", "Secondary school"),
  "grade-9": t("九年级", "Grade 9"),
  "grade-10": t("十年级", "Grade 10"),
  "grade-11": t("十一年级", "Grade 11"),
  "grade-12": t("十二年级", "Grade 12"),
  "middle-school": t("初中", "Middle school"),
  "high-school": t("高中", "High school"),
  "pre-college": t("大学入学前", "Pre-college"),
  "recent-graduate": t("应届高中毕业生", "Recent high-school graduate"),
  "Recommended for Grade 8 and above": t("建议八年级及以上", "Recommended for Grade 8 and above"),
  "university-applicant": t("大学申请者", "University applicant"),
  "university-offer-holder": t("已获大学录取者", "University offer holder"),
  "Year 8 or below": t("英制 Year 8 及以下", "Year 8 or below"),
  "Year 11 or below": t("英制 Year 11 及以下", "Year 11 or below"),
};

const regionLabels: Record<string, LocalizedText> = {
  "Approved overseas schools": t("获准海外学校", "Approved overseas schools"),
  Australia: t("澳大利亚", "Australia"),
  Canada: t("加拿大", "Canada"),
  China: t("中国", "China"),
  Global: t("全球", "Global"),
  "Hong Kong": t("中国香港", "Hong Kong"),
  International: t("国际赛区", "International"),
  Macao: t("中国澳门", "Macao"),
  "Mainland China": t("中国大陆", "Mainland China"),
  "New Zealand": t("新西兰", "New Zealand"),
  Taiwan: t("中国台湾", "Taiwan"),
  "United Kingdom": t("英国", "United Kingdom"),
  "United States": t("美国", "United States"),
  canada: t("加拿大", "Canada"),
  china: t("中国", "China"),
  global: t("全球", "Global"),
  "greater-china": t("中国大陆及港澳台", "Greater China"),
  online: t("线上", "Online"),
  uk: t("英国", "United Kingdom"),
  "united-states": t("美国", "United States"),
  us: t("美国", "United States"),
};

export function gradeLabel(value: string): LocalizedText {
  const key = canonicalGrade(value);
  return gradeLabels[key] ?? t(key, key);
}

export function regionLabel(value: string): LocalizedText {
  const key = canonicalRegion(value);
  return regionLabels[key] ?? t(key, key);
}

export function trackLabel(value: Track): LocalizedText {
  return trackLabels[value];
}

export function canonicalGrade(value: string): string {
  return value === "High school" ? "high-school" : value;
}

export function canonicalRegion(value: string): string {
  if (value === "Canada") return "canada";
  if (value === "China") return "china";
  if (value === "Global") return "global";
  if (value === "United Kingdom") return "uk";
  if (value === "United States" || value === "united-states") return "us";
  return value;
}

export function gradeList(values: string[]): LocalizedText {
  const labels = values.map(gradeLabel);
  return t(labels.map((item) => item.zh).join("、"), labels.map((item) => item.en).join(", "));
}

export function regionList(values: string[]): LocalizedText {
  const labels = values.map(regionLabel);
  return t(labels.map((item) => item.zh).join("、"), labels.map((item) => item.en).join(", "));
}
