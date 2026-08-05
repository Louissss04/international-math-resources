import { t, type ThresholdRecord } from "../lib/types";

export function applyMathematicsThresholdScope(records: ThresholdRecord[]): ThresholdRecord[] {
  return records
    .filter((record) => record.id !== "sat-rw-readiness-benchmark")
    .map((record) => {
      switch (record.id) {
        case "act-current-composite-scale":
          return { ...record, metric: t("ACT Mathematics 官方量尺", "Official ACT Mathematics scale") };
        case "ssat-elementary-total-scale":
          return { ...record, metric: t("Elementary Quantitative 数学分项量尺", "Elementary Quantitative section scale"), value: "300–600", maxScore: "600" };
        case "ssat-middle-total-scale":
          return { ...record, metric: t("Middle Quantitative 数学分项量尺", "Middle Quantitative section scale"), value: "440–710", maxScore: "710" };
        case "ssat-upper-total-scale":
          return { ...record, metric: t("Upper Quantitative 数学分项量尺", "Upper Quantitative section scale"), value: "500–800", maxScore: "800" };
        case "isee-section-scale":
          return { ...record, metric: t("Quantitative Reasoning／Mathematics Achievement 单项量尺", "Quantitative Reasoning / Mathematics Achievement section scale") };
        case "ukiset-percentile-scale":
          return { ...record, metric: t("Mathematics 英国同龄人百分位", "Mathematics UK national percentile") };
        case "ukiset-stanine-scale":
          return { ...record, metric: t("Mathematics stanine", "Mathematics stanine") };
        case "cat4-sas-mean":
          return { ...record, metric: t("数量推理 Standard Age Score 常模均值", "Quantitative Reasoning Standard Age Score norm mean") };
        default:
          return record;
      }
    });
}
