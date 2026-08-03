import type { LocalizedText, ProjectRecord, Track } from "../lib/types";
import { Breadcrumbs } from "./breadcrumbs";
import { CatalogClient } from "./catalog-client";
import { Localized } from "./localized";

export function TrackDirectory({
  title,
  description,
  track,
  projects,
}: {
  title: LocalizedText;
  description: LocalizedText;
  track: Track;
  projects: ProjectRecord[];
}) {
  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: title }]} />
        <div className="page-title-row"><div><h1><Localized text={title} /></h1><p><Localized text={description} /></p></div><b>{projects.length}</b></div>
      </header>
      <section className="page-container directory-section">
        <CatalogClient projects={projects} fixedTrack={track} />
      </section>
    </main>
  );
}

