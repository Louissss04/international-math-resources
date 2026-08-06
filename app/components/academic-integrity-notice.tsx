import Link from "next/link";

type AcademicIntegrityContext = "competition" | "exam" | "research" | "publication" | "application";

const messages: Record<AcademicIntegrityContext, { zh: string; en: string }> = {
  competition: {
    zh: "按当届规则个人作答，或仅在规定队伍范围内协作；不得代考、场外求助、交换答案、获取或传播未公开题目，或伪造成绩与奖项。",
    en: "Complete the event personally, or collaborate only with permitted teammates under the current rules. Do not use proxies or outside help, exchange answers, obtain or distribute unreleased questions, or falsify scores or awards.",
  },
  exam: {
    zh: "考试须由考生本人按当届规则完成；不得代考、场外求助、交换答案、获取或传播未公开试题，或伪造成绩。",
    en: "The registered candidate must complete the test under the current rules. Do not use proxies or outside help, exchange answers, obtain or distribute unreleased questions, or falsify scores.",
  },
  research: {
    zh: "研究和建模须由署名学生实质完成，并如实记录导师、队友、数据、代码及 AI 协助；不得代写、抄袭或伪造证明、数据、图像与引用。",
    en: "Named students must make the substantive contribution to research and modeling work. Record mentoring, team roles, data, code, and AI assistance; do not use ghostwriting, plagiarize, or fabricate proofs, data, images, or references.",
  },
  publication: {
    zh: "投稿须由署名作者实质完成，并如实披露共同作者、导师、工具及 AI 协助；不得代写、抄袭或伪造证明、数据与引用。重复投稿、预印本和 AI 使用以目标刊物现行政策为准。",
    en: "Named authors must make the substantive contribution and disclose co-authors, mentors, tools, and AI assistance. Do not use ghostwriting, plagiarize, or fabricate proofs, data, or references. Follow the target publication’s current policy on simultaneous submissions, preprints, and AI use.",
  },
  application: {
    zh: "申请题、作品和申请材料须由学生本人按项目规则完成；导师、翻译、工具和 AI 的帮助应按要求披露，不得代写、冒名或伪造经历与成果。",
    en: "Students must complete application problems, work samples, and application materials under the program rules. Disclose mentoring, translation, tools, and AI assistance when required; do not use ghostwriting, impersonation, or fabricated experience or results.",
  },
};

export function AcademicIntegrityNotice({
  context,
  className = "",
  showGuideLink,
}: {
  context: AcademicIntegrityContext;
  className?: string;
  showGuideLink?: boolean;
}) {
  const message = messages[context];
  const showGuide = showGuideLink ?? (context === "research" || context === "publication");
  const titleId = `academic-integrity-title-${context}`;

  return (
    <aside className={`academic-integrity-notice ${className}`.trim()} data-academic-integrity={context} aria-labelledby={titleId}>
      <strong id={titleId}><span className="lang-zh">诚信提醒</span><span className="lang-en">Integrity notice</span></strong>
      <p><span className="lang-zh">{message.zh}</span><span className="lang-en">{message.en}</span></p>
      {showGuide && <Link href="/research/integrity"><span className="lang-zh">查看诚信与披露说明</span><span className="lang-en">Integrity and disclosure guide</span></Link>}
    </aside>
  );
}
