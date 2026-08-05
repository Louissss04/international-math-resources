import type {
  VideoResourceAccess,
  VideoResourceAuthority,
  VideoResourceFormat,
  VideoResourceRecord,
} from "../lib/types";
import { t } from "../lib/types";
import { Localized } from "./localized";

const authorityLabels: Record<VideoResourceAuthority, ReturnType<typeof t>> = {
  official: t("官方", "Official"),
  "official-partner": t("官方合作", "Official partner"),
  "third-party": t("第三方", "Third-party"),
};

const formatLabels: Record<VideoResourceFormat, ReturnType<typeof t>> = {
  course: t("完整课程", "Course"),
  playlist: t("播放列表", "Playlist"),
  "lecture-series": t("系列讲座", "Lecture series"),
  "problem-walkthroughs": t("题目讲解", "Problem walkthroughs"),
  "test-familiarisation": t("考试操作说明", "Test familiarisation"),
  webinar: t("公开讲座", "Webinar"),
};

const accessLabels: Record<VideoResourceAccess, ReturnType<typeof t>> = {
  free: t("免费", "Free"),
  "free-account": t("免费，需注册", "Free with account"),
  mixed: t("部分免费", "Some content is free"),
};

const authorityPriority: Record<VideoResourceAuthority, number> = {
  official: 0,
  "official-partner": 1,
  "third-party": 2,
};

export function VideoResourceList({ resources }: { resources: VideoResourceRecord[] }) {
  const orderedResources = [...resources].sort((left, right) => {
    const authorityOrder = authorityPriority[left.authority] - authorityPriority[right.authority];
    return authorityOrder || left.title.en.localeCompare(right.title.en);
  });

  return (
    <div className="video-resource-grid">
      {orderedResources.map((resource) => (
        <article className={`video-resource-card video-authority-${resource.authority}`} data-video-resource-id={resource.id} key={resource.id}>
          <div className="video-resource-meta">
            <span className="video-authority"><Localized text={authorityLabels[resource.authority]} /></span>
            <span><Localized text={formatLabels[resource.format]} /></span>
          </div>
          <h3><a href={resource.url} target="_blank" rel="noreferrer"><Localized text={resource.title} /></a></h3>
          <p className="video-resource-provider"><Localized text={resource.provider} /></p>
          <dl className="video-resource-facts">
            <div><dt><span className="lang-zh">平台</span><span className="lang-en">Platform</span></dt><dd>{resource.platform}</dd></div>
            <div><dt><span className="lang-zh">语言</span><span className="lang-en">Language</span></dt><dd><Localized text={resource.language} /></dd></div>
            <div><dt><span className="lang-zh">访问</span><span className="lang-en">Access</span></dt><dd><Localized text={accessLabels[resource.access]} /></dd></div>
          </dl>
          <p><Localized text={resource.description} /></p>
          {resource.note && <p className="video-resource-note"><Localized text={resource.note} /></p>}
          <a className="video-resource-link" href={resource.url} target="_blank" rel="noreferrer">
            <span className="lang-zh">打开视频资源</span><span className="lang-en">Open video resource</span>
          </a>
        </article>
      ))}
    </div>
  );
}
