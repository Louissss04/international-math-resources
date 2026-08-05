import type {
  BookResourceAuthority,
  BookResourceKind,
  BookResourceRecord,
  LearningResourceAccess,
} from "../lib/types";
import { t } from "../lib/types";
import { Localized } from "./localized";

const authorityLabels: Record<BookResourceAuthority, ReturnType<typeof t>> = {
  official: t("官方出版／主办方资料", "Official or organiser publication"),
  "official-endorsed": t("官方认可／推荐", "Officially endorsed or recommended"),
  "third-party": t("第三方常用书", "Common third-party book"),
};

const kindLabels: Record<BookResourceKind, ReturnType<typeof t>> = {
  "official-publication": t("官方教材／书目", "Official publication or list"),
  "endorsed-textbook": t("认可教材", "Endorsed textbook"),
  textbook: t("教材", "Textbook"),
  "problem-book": t("习题集", "Problem book"),
  workbook: t("练习册", "Workbook"),
  "reference-book": t("参考书", "Reference book"),
  "book-list": t("书目目录", "Book list"),
};

const accessLabels: Record<LearningResourceAccess, ReturnType<typeof t>> = {
  free: t("免费阅读", "Free to read"),
  account: t("免费，可能需注册", "Free; account may be required"),
  mixed: t("部分免费／多种版本", "Some content free or multiple formats"),
  paid: t("需购买", "Purchase required"),
  school: t("学校或考点提供", "Provided through a school or test centre"),
};

const authorityPriority: Record<BookResourceAuthority, number> = {
  official: 0,
  "official-endorsed": 1,
  "third-party": 2,
};

export function BookResourceList({ resources }: { resources: BookResourceRecord[] }) {
  const orderedResources = [...resources].sort((left, right) => {
    const authorityOrder = authorityPriority[left.authority] - authorityPriority[right.authority];
    return authorityOrder || left.title.en.localeCompare(right.title.en);
  });

  return (
    <div className="book-resource-grid">
      {orderedResources.map((resource) => (
        <article className={`book-resource-card book-authority-${resource.authority}`} data-book-resource-id={resource.id} key={resource.id}>
          <div className="book-resource-meta">
            <span className="book-authority"><Localized text={authorityLabels[resource.authority]} /></span>
            <span><Localized text={kindLabels[resource.kind]} /></span>
          </div>
          <h3><a href={resource.url} target="_blank" rel="noreferrer"><Localized text={resource.title} /></a></h3>
          {resource.authors && <p className="book-resource-authors"><span className="lang-zh">作者：</span><span className="lang-en">Author(s): </span><Localized text={resource.authors} /></p>}
          <p className="book-resource-publisher"><span className="lang-zh">出版社／提供方：</span><span className="lang-en">Publisher / provider: </span><Localized text={resource.publisher} /></p>
          <dl className="book-resource-facts">
            {resource.edition && <div><dt><span className="lang-zh">版本</span><span className="lang-en">Edition</span></dt><dd><Localized text={resource.edition} /></dd></div>}
            {resource.isbn && <div><dt>ISBN</dt><dd>{resource.isbn}</dd></div>}
            {resource.language && <div><dt><span className="lang-zh">语言</span><span className="lang-en">Language</span></dt><dd><Localized text={resource.language} /></dd></div>}
            <div><dt><span className="lang-zh">获取</span><span className="lang-en">Access</span></dt><dd><Localized text={accessLabels[resource.access]} /></dd></div>
          </dl>
          <p><Localized text={resource.description} /></p>
          {resource.note && <p className="book-resource-note"><Localized text={resource.note} /></p>}
          <a className="book-resource-link" href={resource.url} target="_blank" rel="noreferrer">
            <span className="lang-zh">查看图书信息</span><span className="lang-en">View book details</span>
          </a>
        </article>
      ))}
    </div>
  );
}
