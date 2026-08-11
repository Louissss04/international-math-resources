import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AcademicIntegrityNotice } from "../../components/academic-integrity-notice";
import { Breadcrumbs } from "../../components/breadcrumbs";
import { Localized } from "../../components/localized";
import {
  chinaAccessLabels,
  formatTagLabels,
  organizerTypeLabels,
  regionLabels,
  universityCompetitions,
  universityCompetitionCountryLabel,
  universityCompetitionStatusLabels,
  type UniversityCompetitionLink,
} from "../../data/university-competitions";
import { t, type LocalizedText } from "../../lib/types";

const registrationLinkPattern = /报名|注册|申请|参赛|registration|register|entry|application|apply/i;
const paperLinkPattern = /历年|题目|试题|真题|样题|样卷|答案|解答|档案|资源|problem|paper|archive|past|sample|solution|question|resource/i;
const resultLinkPattern = /结果|成绩|获奖|名单|排名|证书|result|award|winner|ranking|certificate/i;

function matchesLink(link: UniversityCompetitionLink, pattern: RegExp) {
  return pattern.test(`${link.label.zh} ${link.label.en}`);
}

function LinkList({ links }: { links: UniversityCompetitionLink[] }) {
  return (
    <div className="requirement-tests">
      {links.map((link, index) => (
        <a href={link.url} target="_blank" rel="noreferrer" key={`${link.url}-${index}`}>
          <Localized text={link.label} />
        </a>
      ))}
    </div>
  );
}

function MissingEntry({ kind, historical }: { kind: "registration" | "papers" | "results"; historical: boolean }) {
  const messages: Record<typeof kind, LocalizedText> = {
    registration: historical
      ? t(
          "当前收录的官方页面未单列可用的公开报名入口；历史页面不能作为现行报名路径。",
          "The official pages currently recorded do not list an active public registration entry; historical pages are not a current registration route.",
        )
      : t(
          "当前收录的官方页面未单列公开报名入口；如本周期尚未开放，须等待主办方公布。",
          "The official pages currently recorded do not list a separate public registration entry; if the cycle is not yet open, wait for the organizer's announcement.",
        ),
    papers: t(
      "当前收录的官方页面未单列公开真题、样题或题目档案入口；不据此推断主办方从未公开材料。",
      "The official pages currently recorded do not list a separate public past-paper, sample-question, or problem archive; this does not establish that the organizer has never released materials.",
    ),
    results: t(
      "当前收录的官方页面未单列公开结果、获奖名单或成绩档案入口；如本周期尚未结束，须等待主办方公布。",
      "The official pages currently recorded do not list a separate public results, award-list, or ranking archive; if the cycle is still under way, wait for the organizer's publication.",
    ),
  };
  return <Localized text={messages[kind]} />;
}

export function generateStaticParams() {
  return universityCompetitions.map((record) => ({ id: record.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const record = universityCompetitions.find((item) => item.id === id);
  if (!record) return {};
  return {
    title: `${record.title.zh} / ${record.title.en}`,
    description: `${record.organizer.zh}。${record.eligibility.zh} ${record.organizer.en}. ${record.eligibility.en}`,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = universityCompetitions.find((item) => item.id === id);
  if (!record) notFound();

  const registrationLinks = record.officialLinks.filter((link) => matchesLink(link, registrationLinkPattern));
  const paperLinks = record.officialLinks.filter((link) => matchesLink(link, paperLinkPattern));
  const resultLinks = record.officialLinks.filter((link) => matchesLink(link, resultLinkPattern));
  const primaryOfficialLink = record.officialLinks[0];
  const historical = record.status === "historical";

  return (
    <main
      data-university-competition-detail
      data-university-competition-id={record.id}
      data-last-verified={record.lastVerified}
    >
      <div className="page-container detail-top">
        <Breadcrumbs items={[
          { label: t("数学竞赛", "Mathematics competitions"), href: "/competitions" },
          { label: t("大学主办与学生组织竞赛", "University-organized competitions"), href: "/university-competitions" },
          { label: record.title },
        ]} />

        <div className="record-heading">
          <div>
            <div className="record-kicker">
              <span className="track-badge"><Localized text={organizerTypeLabels[record.organizerType]} /></span>
              <span>{record.shortTitle}</span>
            </div>
            <h1><Localized text={record.title} /></h1>
            <p className="record-summary"><Localized text={record.organizer} /> · <Localized text={record.institutions} /></p>
          </div>
          <div className="record-actions">
            {record.internalHref && (
              <Link className="primary-button" href={record.internalHref}>
                <span className="lang-zh">本站专项档案</span><span className="lang-en">Dedicated site record</span>
              </Link>
            )}
            {primaryOfficialLink && (
              <a className={record.internalHref ? "secondary-button" : "primary-button"} href={primaryOfficialLink.url} target="_blank" rel="noreferrer">
                <span className="lang-zh">首要官方页面</span><span className="lang-en">Primary official page</span>
              </a>
            )}
          </div>
        </div>

        <dl className="fact-grid">
          <div><dt><span className="lang-zh">主办关系</span><span className="lang-en">Organizer relationship</span></dt><dd><Localized text={organizerTypeLabels[record.organizerType]} /></dd></div>
          <div><dt><span className="lang-zh">当前周期</span><span className="lang-en">Current cycle</span></dt><dd>{record.cycle}</dd></div>
          <div><dt><span className="lang-zh">当前状态</span><span className="lang-en">Current status</span></dt><dd><Localized text={universityCompetitionStatusLabels[record.status]} /></dd></div>
          <div><dt><span className="lang-zh">地区</span><span className="lang-en">Region</span></dt><dd><Localized text={regionLabels[record.region]} /> · <Localized text={universityCompetitionCountryLabel(record.country)} /></dd></div>
          <div><dt><span className="lang-zh">形式类别</span><span className="lang-en">Format category</span></dt><dd><Localized text={formatTagLabels[record.formatTag]} /></dd></div>
          <div><dt><span className="lang-zh">中国学生可达性</span><span className="lang-en">Access from China</span></dt><dd><Localized text={chinaAccessLabels[record.chinaAccess]} /></dd></div>
        </dl>

        <AcademicIntegrityNotice context="competition" />
        <div className="record-stamp">
          <span><span className="lang-zh">最后核验</span><span className="lang-en">Last verified</span>: {record.lastVerified}</span>
        </div>
      </div>

      <div className="record-layout page-container">
        <aside className="section-index" aria-label="On this page">
          <strong><span className="lang-zh">本页内容</span><span className="lang-en">On this page</span></strong>
          <a href="#organizer"><span className="lang-zh">主办机构与状态</span><span className="lang-en">Organizer and status</span></a>
          <a href="#entry-format"><span className="lang-zh">资格、赛制与费用</span><span className="lang-en">Eligibility, format and fee</span></a>
          <a href="#china-access"><span className="lang-zh">中国学生路径</span><span className="lang-en">Access from China</span></a>
          <a href="#official-links"><span className="lang-zh">官方链接与材料</span><span className="lang-en">Official links and materials</span></a>
          {record.internalHref && <a href="#site-record"><span className="lang-zh">本站专项档案</span><span className="lang-en">Dedicated site record</span></a>}
        </aside>

        <div className="record-content">
          <section id="organizer" className="record-section">
            <h2><span className="lang-zh">主办机构与当前状态</span><span className="lang-en">Organizer and current status</span></h2>
            <dl className="journal-policy-list">
              <div><dt><span className="lang-zh">关联大学／机构</span><span className="lang-en">Institution(s)</span></dt><dd><Localized text={record.institutions} /></dd></div>
              <div><dt><span className="lang-zh">实际运营方</span><span className="lang-en">Operating organizer</span></dt><dd><Localized text={record.organizer} /></dd></div>
              <div><dt><span className="lang-zh">关系分类</span><span className="lang-en">Relationship classification</span></dt><dd><Localized text={organizerTypeLabels[record.organizerType]} /></dd></div>
              <div><dt><span className="lang-zh">当前周期</span><span className="lang-en">Current cycle</span></dt><dd>{record.cycle}</dd></div>
              <div><dt><span className="lang-zh">状态</span><span className="lang-en">Status</span></dt><dd><Localized text={universityCompetitionStatusLabels[record.status]} /></dd></div>
              {record.note && <div><dt><span className="lang-zh">补充说明</span><span className="lang-en">Record note</span></dt><dd><Localized text={record.note} /></dd></div>}
            </dl>
          </section>

          <section id="entry-format" className="record-section">
            <h2><span className="lang-zh">资格、赛制与费用</span><span className="lang-en">Eligibility, format and fee</span></h2>
            <dl className="journal-policy-list">
              <div><dt><span className="lang-zh">参赛资格</span><span className="lang-en">Eligibility</span></dt><dd><Localized text={record.eligibility} /></dd></div>
              <div><dt><span className="lang-zh">比赛形式</span><span className="lang-en">Competition format</span></dt><dd><Localized text={record.format} /></dd></div>
              <div><dt><span className="lang-zh">形式类别</span><span className="lang-en">Format category</span></dt><dd><Localized text={formatTagLabels[record.formatTag]} /></dd></div>
              <div><dt><span className="lang-zh">费用</span><span className="lang-en">Fee</span></dt><dd><Localized text={record.fee} /></dd></div>
            </dl>
          </section>

          <section id="china-access" className="record-section">
            <h2><span className="lang-zh">中国学生参与路径</span><span className="lang-en">Participation route from China</span></h2>
            <p className="section-intro"><Localized text={chinaAccessLabels[record.chinaAccess]} /></p>
            <p><Localized text={record.chinaPath} /></p>
          </section>

          <section id="official-links" className="record-section">
            <h2><span className="lang-zh">官方链接与公开材料</span><span className="lang-en">Official links and public materials</span></h2>
            {record.officialLinks.length > 0 ? (
              <div className="journal-link-grid">
                {record.officialLinks.map((link, index) => (
                  <a href={link.url} target="_blank" rel="noreferrer" key={`${link.url}-${index}`}>
                    <small><span className="lang-zh">官方来源</span><span className="lang-en">Official source</span></small>
                    <strong><Localized text={link.label} /></strong>
                    <span>{link.url}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p><span className="lang-zh">当前记录未列出可用的官方链接，待主办方公布或恢复页面。</span><span className="lang-en">This record currently has no listed official link; publication or restoration by the organizer is pending.</span></p>
            )}

            <h3><span className="lang-zh">报名入口</span><span className="lang-en">Registration entry</span></h3>
            {registrationLinks.length > 0 ? <LinkList links={registrationLinks} /> : <p><MissingEntry kind="registration" historical={historical} /></p>}

            <h3><span className="lang-zh">真题、样题或题目档案</span><span className="lang-en">Past papers, samples, or problem archive</span></h3>
            {paperLinks.length > 0 ? <LinkList links={paperLinks} /> : <p><MissingEntry kind="papers" historical={historical} /></p>}

            <h3><span className="lang-zh">结果、获奖名单或成绩档案</span><span className="lang-en">Results, awards, or ranking archive</span></h3>
            {resultLinks.length > 0 ? <LinkList links={resultLinks} /> : <p><MissingEntry kind="results" historical={historical} /></p>}

            <aside className="resource-note">
              <strong><span className="lang-zh">来源与版权</span><span className="lang-en">Sources and copyright</span></strong>
              <p><span className="lang-zh">本页整理并链接主办方、大学或院系公开页面，不代替当届规则，也不在此页托管试题文件。竞赛名称、标识、题目及原页面内容的版权归相应权利人所有。</span><span className="lang-en">This page organizes and links public pages from organizers, universities, or departments. It does not replace the current rules and does not host question files. Competition names, marks, problems, and source-page content remain the property of their respective rights holders.</span></p>
            </aside>
          </section>

          {record.internalHref && (
            <section id="site-record" className="record-section">
              <h2><span className="lang-zh">本站专项档案</span><span className="lang-en">Dedicated site record</span></h2>
              <p><span className="lang-zh">本站已为该项目单独整理更完整的赛制、日期或历史资料。</span><span className="lang-en">A separate site record contains the fuller format, dates, or historical material already compiled for this competition.</span></p>
              <Link className="primary-button" href={record.internalHref}><span className="lang-zh">打开专项档案</span><span className="lang-en">Open dedicated record</span></Link>
            </section>
          )}

          <p className="journal-back-link"><Link href="/university-competitions"><span className="lang-zh">返回大学组织竞赛目录</span><span className="lang-en">Back to university-organized competition directory</span></Link></p>
        </div>
      </div>
    </main>
  );
}
