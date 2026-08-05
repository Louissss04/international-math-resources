import { Localized } from "./localized";
import type { PastPaperArchiveRecord } from "../lib/types";
import { pastPaperAccessLabels, pastPaperAuthorityLabels, pastPaperAvailabilityLabels, pastPaperKindLabels } from "../lib/past-paper-labels";

export function PastPaperCopyright() {
  return (
    <aside className="past-paper-copyright">
      <strong><span className="lang-zh">版权与链接说明</span><span className="lang-en">Copyright and linking notice</span></strong>
      <p>
        <span className="lang-zh">本站只整理网络公开页面的入口，不复制、上传或重新托管试题文件。版权归主办方、作者或发布平台所有。第三方整理仅作为索引，不代表主办方认可；下载、打印和传播前请查看原站条款。如权利人要求移除，将删除相应链接。</span>
        <span className="lang-en">This site only indexes publicly accessible web pages and does not copy, upload or rehost test files. Copyright remains with the organiser, author or publishing platform. A third-party index does not imply organiser endorsement. Check the source terms before downloading, printing or sharing. Links will be removed upon a valid rights-holder request.</span>
      </p>
    </aside>
  );
}

export function PastPaperSection({ archive, showCopyright = true }: { archive?: PastPaperArchiveRecord; showCopyright?: boolean }) {
  return (
    <section id="past-papers" className="record-section past-paper-section">
      <div className="section-title-row">
        <h2><span className="lang-zh">真题、样卷与答案入口</span><span className="lang-en">Past papers, samples and solutions</span></h2>
        {archive && <span className={`past-paper-status past-paper-${archive.availability}`}><Localized text={pastPaperAvailabilityLabels[archive.availability]} /></span>}
      </div>

      {archive ? (
        <>
          <p className="section-intro"><Localized text={archive.summary} /></p>
          {archive.links.length > 0 ? (
            <div className="past-paper-links">
              {archive.links.map((link) => (
                <article className={`past-paper-link past-paper-authority-${link.authority}`} key={`${archive.id}-${link.url}`}>
                  <div className="past-paper-link-meta">
                    <span><Localized text={pastPaperAuthorityLabels[link.authority]} /></span>
                    <span><Localized text={pastPaperKindLabels[link.kind]} /></span>
                    <span><Localized text={pastPaperAccessLabels[link.access]} /></span>
                  </div>
                  <h3><a href={link.url} target="_blank" rel="noreferrer"><Localized text={link.title} /></a></h3>
                  <p><Localized text={link.provider} /></p>
                  {link.note && <small><Localized text={link.note} /></small>}
                  <a className="past-paper-open" href={link.url} target="_blank" rel="noreferrer">
                    <span className="lang-zh">打开原页面</span><span className="lang-en">Open source page</span>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="past-paper-empty">
              <p><span className="lang-zh">截至 {archive.lastVerified}，暂未找到可核验的公开真题或样卷入口。主办方发布后再补录；不使用来源不明的文件替代。</span><span className="lang-en">As of {archive.lastVerified}, no verifiable public past-paper or sample source has been found. A source will be added after publication by the organiser; files of unclear origin are not substituted.</span></p>
            </div>
          )}
          <p className="past-paper-verified"><span className="lang-zh">链接检查：{archive.lastVerified}</span><span className="lang-en">Links checked: {archive.lastVerified}</span></p>
        </>
      ) : (
        <div className="past-paper-empty">
          <p><span className="lang-zh">暂未找到可核验的公开真题或样卷入口。</span><span className="lang-en">No verifiable public past-paper or sample source has been found.</span></p>
        </div>
      )}

      {showCopyright && <PastPaperCopyright />}
    </section>
  );
}
