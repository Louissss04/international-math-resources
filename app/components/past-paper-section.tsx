import { Localized } from "./localized";
import type { PastPaperArchiveRecord } from "../lib/types";
import { pastPaperAccessLabels, pastPaperAuthorityLabels, pastPaperAvailabilityLabels, pastPaperKindLabels } from "../lib/past-paper-labels";

export function PastPaperCopyright() {
  return (
    <aside className="past-paper-copyright">
      <strong><span className="lang-zh">版权与链接说明</span><span className="lang-en">Copyright and linking notice</span></strong>
      <p>
        <span className="lang-zh">本站只链接公开来源，不复制或托管试题文件。版权归原权利人；使用前请查看原站条款。</span>
        <span className="lang-en">This site links to public sources and does not copy or host test files. Copyright remains with the rights holder; check the source terms before use.</span>
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
              <p><span className="lang-zh">暂未找到可核验的公开真题或样卷入口。</span><span className="lang-en">No verifiable public past-paper or sample source has been found.</span></p>
            </div>
          )}
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
