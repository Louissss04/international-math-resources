"use client";

import { useMemo, useState } from "react";
import {
  journalAudienceLabels,
  journalFeeLabels,
  journalOutcomeLabels,
  journalReviewLabels,
  journalSubmissionLabels,
  journalTopicLabels,
  journalTypeLabels,
} from "../lib/journal-labels";
import { journalHref } from "../lib/paths";
import type {
  JournalAudienceScope,
  JournalFeeCategory,
  JournalOutcomeType,
  JournalRecord,
  JournalReviewModel,
  JournalSubmissionStatus,
  JournalTopicTag,
} from "../lib/types";
import { Localized } from "./localized";

const all = "all";

function searchText(journal: JournalRecord) {
  return [
    journal.title.zh,
    journal.title.en,
    journal.shortTitle,
    journal.publisher.zh,
    journal.publisher.en,
    journal.summary.zh,
    journal.summary.en,
    journalTypeLabels[journal.journalType].zh,
    journalTypeLabels[journal.journalType].en,
    ...journal.topicTags.flatMap((topic) => [journalTopicLabels[topic].zh, journalTopicLabels[topic].en]),
  ].join(" ").toLowerCase();
}

export function JournalDirectory({ journals }: { journals: JournalRecord[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<JournalTopicTag | typeof all>(all);
  const [audience, setAudience] = useState<JournalAudienceScope | typeof all>(all);
  const [review, setReview] = useState<JournalReviewModel | typeof all>(all);
  const [submission, setSubmission] = useState<JournalSubmissionStatus | typeof all>(all);
  const [outcome, setOutcome] = useState<JournalOutcomeType | typeof all>(all);
  const [fee, setFee] = useState<JournalFeeCategory | typeof all>(all);

  const topics = useMemo(() => Array.from(new Set(journals.flatMap((journal) => journal.topicTags))).sort(), [journals]);
  const audiences = useMemo(() => Array.from(new Set(journals.map((journal) => journal.audienceScope))).sort(), [journals]);
  const reviews = useMemo(() => Array.from(new Set(journals.map((journal) => journal.reviewModel))).sort(), [journals]);
  const submissions = useMemo(() => Array.from(new Set(journals.map((journal) => journal.submissionStatus))).sort(), [journals]);
  const outcomes = useMemo(() => Array.from(new Set(journals.map((journal) => journal.outcomeType))).sort(), [journals]);
  const fees = useMemo(() => Array.from(new Set(journals.map((journal) => journal.feeCategory))).sort(), [journals]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return journals.filter((journal) => (
      (!needle || searchText(journal).includes(needle))
      && (topic === all || journal.topicTags.includes(topic))
      && (audience === all || journal.audienceScope === audience)
      && (review === all || journal.reviewModel === review)
      && (submission === all || journal.submissionStatus === submission)
      && (outcome === all || journal.outcomeType === outcome)
      && (fee === all || journal.feeCategory === fee)
    ));
  }, [journals, query, topic, audience, review, submission, outcome, fee]);

  function reset() {
    setQuery("");
    setTopic(all);
    setAudience(all);
    setReview(all);
    setSubmission(all);
    setOutcome(all);
    setFee(all);
  }

  return (
    <div data-static-component="journal-directory" data-journal-ids={journals.map((journal) => journal.id).join("|")}>
      <div className="journal-filters">
        <label className="filter-search">
          <span className="lang-zh">关键词</span><span className="lang-en">Keyword</span>
          <input data-journal-filter="query" value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="期刊 / number theory / modeling" />
        </label>
        <label>
          <span className="lang-zh">数学主题</span><span className="lang-en">Topic</span>
          <select data-journal-filter="topic" value={topic} onChange={(event) => setTopic(event.target.value as JournalTopicTag | typeof all)}>
            <option value={all}>全部 / All</option>
            {topics.map((value) => <option key={value} value={value}>{journalTopicLabels[value].zh} / {journalTopicLabels[value].en}</option>)}
          </select>
        </label>
        <label>
          <span className="lang-zh">作者范围</span><span className="lang-en">Author scope</span>
          <select data-journal-filter="audience" value={audience} onChange={(event) => setAudience(event.target.value as JournalAudienceScope | typeof all)}>
            <option value={all}>全部 / All</option>
            {audiences.map((value) => <option key={value} value={value}>{journalAudienceLabels[value].zh} / {journalAudienceLabels[value].en}</option>)}
          </select>
        </label>
        <label>
          <span className="lang-zh">评审方式</span><span className="lang-en">Review</span>
          <select data-journal-filter="review" value={review} onChange={(event) => setReview(event.target.value as JournalReviewModel | typeof all)}>
            <option value={all}>全部 / All</option>
            {reviews.map((value) => <option key={value} value={value}>{journalReviewLabels[value].zh} / {journalReviewLabels[value].en}</option>)}
          </select>
        </label>
        <label>
          <span className="lang-zh">投稿状态</span><span className="lang-en">Submissions</span>
          <select data-journal-filter="submission" value={submission} onChange={(event) => setSubmission(event.target.value as JournalSubmissionStatus | typeof all)}>
            <option value={all}>全部 / All</option>
            {submissions.map((value) => <option key={value} value={value}>{journalSubmissionLabels[value].zh} / {journalSubmissionLabels[value].en}</option>)}
          </select>
        </label>
        <label>
          <span className="lang-zh">发表形式</span><span className="lang-en">Outcome</span>
          <select data-journal-filter="outcome" value={outcome} onChange={(event) => setOutcome(event.target.value as JournalOutcomeType | typeof all)}>
            <option value={all}>全部 / All</option>
            {outcomes.map((value) => <option key={value} value={value}>{journalOutcomeLabels[value].zh} / {journalOutcomeLabels[value].en}</option>)}
          </select>
        </label>
        <label>
          <span className="lang-zh">费用</span><span className="lang-en">Fees</span>
          <select data-journal-filter="fee" value={fee} onChange={(event) => setFee(event.target.value as JournalFeeCategory | typeof all)}>
            <option value={all}>全部 / All</option>
            {fees.map((value) => <option key={value} value={value}>{journalFeeLabels[value].zh} / {journalFeeLabels[value].en}</option>)}
          </select>
        </label>
      </div>

      <div className="result-toolbar" aria-live="polite">
        <p><b data-journal-result-count>{visible.length}</b> <span className="lang-zh">种刊物</span><span className="lang-en">publications</span></p>
        <button data-journal-reset type="button" onClick={reset}><span className="lang-zh">重置</span><span className="lang-en">Reset</span></button>
      </div>

      <div className="table-scroll journal-directory-table" hidden={!visible.length} data-journal-results>
        <table>
          <thead><tr>
            <th><span className="lang-zh">期刊／刊物</span><span className="lang-en">Journal / publication</span></th>
            <th><span className="lang-zh">作者范围</span><span className="lang-en">Author scope</span></th>
            <th><span className="lang-zh">主要数学主题</span><span className="lang-en">Main topics</span></th>
            <th><span className="lang-zh">发表形式</span><span className="lang-en">Outcome</span></th>
            <th><span className="lang-zh">评审</span><span className="lang-en">Review</span></th>
            <th><span className="lang-zh">投稿状态</span><span className="lang-en">Submissions</span></th>
            <th><span className="lang-zh">费用</span><span className="lang-en">Fees</span></th>
          </tr></thead>
          <tbody>{visible.map((journal) => (
            <tr
              key={journal.id}
              data-journal-row
              data-journal-id={journal.id}
              data-search={searchText(journal)}
              data-topic={journal.topicTags.join("|")}
              data-audience={journal.audienceScope}
              data-review={journal.reviewModel}
              data-submission={journal.submissionStatus}
              data-outcome={journal.outcomeType}
              data-fee={journal.feeCategory}
            >
              <th scope="row"><a href={journalHref(journal)}>{journal.shortTitle}</a><small><Localized text={journal.title} /></small><small><Localized text={journalTypeLabels[journal.journalType]} /> · <Localized text={journal.publisher} /></small></th>
              <td><Localized text={journalAudienceLabels[journal.audienceScope]} /></td>
              <td><div className="journal-topic-list">{journal.topicTags.map((value) => <span key={value}><Localized text={journalTopicLabels[value]} /></span>)}</div></td>
              <td><Localized text={journalOutcomeLabels[journal.outcomeType]} /></td>
              <td><Localized text={journalReviewLabels[journal.reviewModel]} /></td>
              <td><Localized text={journalSubmissionLabels[journal.submissionStatus]} /></td>
              <td><Localized text={journalFeeLabels[journal.feeCategory]} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <p className="empty-state" data-journal-empty hidden={visible.length > 0}><span className="lang-zh">没有匹配记录。</span><span className="lang-en">No matching records.</span></p>
    </div>
  );
}
