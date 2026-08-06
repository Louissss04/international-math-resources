type SiteEngagementProps = {
  apiUrl: string;
};

export function SiteEngagement({ apiUrl }: SiteEngagementProps) {
  const endpoint = apiUrl.trim().replace(/\/+$/, "");

  return (
    <section
      className="site-engagement"
      data-static-component="engagement"
      data-api-url={endpoint}
      hidden={!endpoint}
      aria-label="Site feedback"
    >
      <div className="engagement-inner">
        <div className="engagement-metrics" aria-live="polite">
          <span>
            <span className="lang-zh">本站访问</span><span className="lang-en">Site visits</span>
            <b data-engagement-site-visits>—</b>
          </span>
          <span>
            <span className="lang-zh">本页浏览</span><span className="lang-en">Page views</span>
            <b data-engagement-page-views>—</b>
          </span>
        </div>
        <div className="engagement-actions">
          <button className="helpful-button" type="button" aria-pressed="false" data-engagement-helpful>
            <span className="lang-zh">觉得本页有用</span><span className="lang-en">This page was useful</span>
            <b data-engagement-helpful-count>—</b>
          </button>
          <button className="feedback-open" type="button" data-feedback-open>
            <span className="lang-zh">留言反馈</span><span className="lang-en">Send feedback</span>
          </button>
        </div>
      </div>
      <p className="engagement-status" role="status" aria-live="polite" aria-atomic="true" data-engagement-status />

      <dialog className="feedback-dialog" data-feedback-dialog aria-labelledby="feedback-dialog-title">
        <form className="feedback-form" method="dialog" data-feedback-form>
          <div className="feedback-heading">
            <div>
              <h2 id="feedback-dialog-title"><span className="lang-zh">留言反馈</span><span className="lang-en">Send feedback</span></h2>
              <p><span className="lang-zh">留言不会公开，仅供本站维护者查看。</span><span className="lang-en">Messages are private and visible only to the site maintainer.</span></p>
            </div>
            <button type="button" className="feedback-close" data-feedback-close aria-label="Close">×</button>
          </div>

          <p className="feedback-page">
            <span className="lang-zh">相关页面</span><span className="lang-en">Related page</span>
            <code data-feedback-page>—</code>
          </p>

          <label>
            <span className="lang-zh">问题类型</span><span className="lang-en">Category</span>
            <select name="category" required>
              <option value="content_error">内容错误 / Content error</option>
              <option value="broken_link">链接失效 / Broken link</option>
              <option value="date_update">日期或分数线更新 / Date or score update</option>
              <option value="suggestion">内容建议 / Suggestion</option>
              <option value="question">问题咨询 / Question</option>
              <option value="other">其他 / Other</option>
            </select>
          </label>

          <label>
            <span className="lang-zh">留言内容</span><span className="lang-en">Message</span>
            <textarea name="message" required minLength={10} maxLength={2000} rows={7} aria-describedby="feedback-privacy" />
            <small><span className="lang-zh">10—2000 字，最多附两个链接。</span><span className="lang-en">10–2,000 characters; up to two links.</span></small>
          </label>

          <label>
            <span className="lang-zh">回复邮箱（可选）</span><span className="lang-en">Reply email (optional)</span>
            <input name="contact" type="email" maxLength={200} autoComplete="email" />
          </label>

          <label className="feedback-honeypot" aria-hidden="true">
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>

          <p id="feedback-privacy" className="feedback-privacy">
            <span className="lang-zh">请勿填写姓名、学校、电话、微信、证件、申请号或成绩单。未满 14 周岁请勿留下联系方式。</span>
            <span className="lang-en">Do not include names, schools, phone numbers, messaging IDs, identity documents, application numbers or transcripts. If you are under 14, do not provide contact details.</span>
          </p>

          <p className="feedback-status" role="status" aria-live="polite" aria-atomic="true" data-feedback-status />
          <div className="feedback-actions">
            <button className="secondary-button" type="button" data-feedback-copy hidden>
              <span className="lang-zh">复制留言</span><span className="lang-en">Copy message</span>
            </button>
            <button className="secondary-button" type="button" data-feedback-close>
              <span className="lang-zh">取消</span><span className="lang-en">Cancel</span>
            </button>
            <button className="primary-button" type="submit" data-feedback-submit>
              <span className="lang-zh">提交</span><span className="lang-en">Submit</span>
            </button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
