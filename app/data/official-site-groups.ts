import { t } from "../lib/types";

export const unitedStatesOfficialSiteGroup = {
  id: "united-states",
  title: t("美国本科申请官网", "United States undergraduate admissions official sites"),
  sourceIds: [
    "us-uc-international-first-year",
    "us-uc-country-requirements",
    "us-uc-first-year-requirements",
    "us-uc-application-test-policy",
    "us-uc-transcript-submission",
    "us-mit-math-foundations",
    "us-mit-tests-scores",
    "us-stanford-international",
    "us-stanford-math-preparation",
    "us-stanford-testing",
    "us-stanford-transcripts",
    "us-harvard-math-preparation",
    "us-harvard-application-requirements",
    "us-cornell-college-requirements",
  ],
} as const;

export const unitedKingdomOfficialSiteGroup = {
  id: "united-kingdom",
  title: t("英国本科申请官网", "United Kingdom undergraduate admissions official sites"),
  sourceIds: [
    "uk-ucas-how-to-apply",
    "uk-ucas-2027-dates",
    "uk-ucas-admissions-tests",
    "uk-cambridge-mathematics-2027",
    "uk-cambridge-international-entry-2027",
    "uk-cambridge-accepted-qualifications-2027",
    "uk-oxford-mathematics-course",
    "uk-oxford-mathematics-2027",
    "uk-oxford-admissions-tests-2027",
    "uk-oxford-international-qualifications",
    "uk-imperial-mathematics-2027",
    "uk-warwick-mathematics-offer-2027",
    "uk-warwick-admissions-tests-2027",
  ],
} as const;

export const singaporeOfficialSiteGroup = {
  id: "singapore",
  title: t("新加坡本科申请官网", "Singapore undergraduate admissions official sites"),
  sourceIds: [
    "sg-moe-autonomous-universities",
    "sg-nus-international-qualifications-2026",
    "sg-nus-gaokao-2026",
    "sg-nus-international-a-level-2026",
    "sg-nus-standardised-tests-2026",
    "sg-nus-mathematics-major",
    "sg-ntu-admission-guide-2026",
    "sg-ntu-international-qualifications-2026",
    "sg-ntu-gaokao-2027",
    "sg-ntu-mathematical-sciences",
    "sg-ntu-ib-2026",
    "sg-ntu-a-level-timing",
  ],
} as const;

export const australiaOfficialSiteGroup = {
  id: "australia",
  title: t("澳大利亚本科申请官网", "Australia undergraduate admissions official sites"),
  sourceIds: [
    "dest-au-study-apply",
    "dest-au-school-qualifications",
    "dest-au-uac-international",
    "dest-au-uac-ib",
    "dest-au-melbourne-entry",
    "dest-au-melbourne-equivalents",
    "dest-au-monash-gaokao",
    "dest-au-monash-prerequisites",
  ],
} as const;

export const canadaOfficialSiteGroup = {
  id: "canada",
  title: t("加拿大本科申请官网", "Canada undergraduate admissions official sites"),
  sourceIds: [
    "ca-cmec-postsecondary",
    "ca-uoft-international-curricula",
    "ca-uoft-engineering-international",
    "ca-uoft-required-documents",
    "ca-waterloo-how-to-apply",
    "ca-waterloo-required-documents",
    "ca-waterloo-math-a-level",
    "ca-waterloo-cs-ib",
    "ca-waterloo-cs-china",
    "ca-waterloo-supplement",
    "ca-ubc-requirements",
    "ca-ubc-ap",
    "ca-ubc-ib",
    "ca-ubc-math-bsc",
    "ca-ubc-documents",
    "ca-mcgill-requirements",
    "ca-mcgill-ib",
  ],
} as const;

export const otherEuropeOfficialSiteGroup = {
  id: "other-europe",
  title: t("欧洲其他国家本科申请官网", "Undergraduate admissions official sites in other European countries"),
  sourceIds: [
    "dest-eu-nl-admission",
    "dest-eu-nl-apply",
    "dest-eu-groningen-math",
    "dest-eu-daad-admission",
    "dest-eu-uniassist-china",
    "dest-eu-swiss-countries",
    "dest-eu-eth-2026",
    "dest-eu-epfl-exam",
    "dest-eu-france-apply",
    "dest-eu-ucd-china",
  ],
} as const;

export const destinationOfficialSiteGroups = [
  unitedStatesOfficialSiteGroup,
  unitedKingdomOfficialSiteGroup,
  singaporeOfficialSiteGroup,
  australiaOfficialSiteGroup,
  canadaOfficialSiteGroup,
  otherEuropeOfficialSiteGroup,
] as const;

export const projectTrackGroups = [
  {
    id: "competition",
    title: t("数学竞赛官网", "Mathematics competition official sites"),
  },
  {
    id: "modeling",
    title: t("数学建模竞赛与项目官网", "Mathematical modeling competitions and projects official sites"),
  },
  {
    id: "research",
    title: t("数学科研官方资源", "Official mathematics research resources"),
  },
  {
    id: "summer",
    title: t("数学夏校与夏令营官网", "Mathematics summer program official sites"),
  },
  {
    id: "curriculum",
    title: t("国际数学课程官网", "International mathematics curriculum official sites"),
  },
  {
    id: "assessment",
    title: t("数学考试与测评官网", "Mathematics test and assessment official sites"),
  },
] as const;
