PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS global_stats (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  site_visits INTEGER NOT NULL DEFAULT 0 CHECK (site_visits >= 0),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO global_stats (id, site_visits) VALUES (1, 0);

CREATE TABLE IF NOT EXISTS page_stats (
  path TEXT PRIMARY KEY,
  page_views INTEGER NOT NULL DEFAULT 0 CHECK (page_views >= 0),
  likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- One site visit per anonymous browser per calendar day.
CREATE TABLE IF NOT EXISTS daily_site_visitors (
  day TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (day, visitor_hash)
) WITHOUT ROWID;

-- One page view per anonymous browser, page and calendar day.
CREATE TABLE IF NOT EXISTS daily_page_views (
  day TEXT NOT NULL,
  path TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (day, path, visitor_hash)
) WITHOUT ROWID;

-- One current like per anonymous browser and page. Deleting the row removes the like.
CREATE TABLE IF NOT EXISTS page_likes (
  path TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (path, visitor_hash)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS daily_limits (
  day TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('view', 'like', 'feedback')),
  subject_hash TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (day, action, subject_hash)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS feedback (
  receipt_id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  path TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN ('content_error', 'broken_link', 'date_update', 'suggestion', 'question', 'other')
  ),
  message TEXT NOT NULL CHECK (length(message) BETWEEN 10 AND 2000),
  contact TEXT CHECK (contact IS NULL OR length(contact) <= 200),
  language TEXT NOT NULL CHECK (language IN ('zh-CN', 'en')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'resolved', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (visitor_hash, submission_id)
);

CREATE INDEX IF NOT EXISTS feedback_status_created_at_idx
  ON feedback (status, created_at DESC);

CREATE INDEX IF NOT EXISTS feedback_created_at_idx
  ON feedback (created_at DESC);

CREATE TRIGGER IF NOT EXISTS daily_site_visitors_after_insert
AFTER INSERT ON daily_site_visitors
BEGIN
  UPDATE global_stats
  SET site_visits = site_visits + 1,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS daily_page_views_after_insert
AFTER INSERT ON daily_page_views
BEGIN
  INSERT INTO page_stats (path, page_views, likes, updated_at)
  VALUES (NEW.path, 1, 0, CURRENT_TIMESTAMP)
  ON CONFLICT(path) DO UPDATE SET
    page_views = page_views + 1,
    updated_at = CURRENT_TIMESTAMP;
END;

CREATE TRIGGER IF NOT EXISTS page_likes_after_insert
AFTER INSERT ON page_likes
BEGIN
  INSERT INTO page_stats (path, page_views, likes, updated_at)
  VALUES (NEW.path, 0, 1, CURRENT_TIMESTAMP)
  ON CONFLICT(path) DO UPDATE SET
    likes = likes + 1,
    updated_at = CURRENT_TIMESTAMP;
END;

CREATE TRIGGER IF NOT EXISTS page_likes_after_delete
AFTER DELETE ON page_likes
BEGIN
  UPDATE page_stats
  SET likes = MAX(likes - 1, 0),
      updated_at = CURRENT_TIMESTAMP
  WHERE path = OLD.path;
END;
