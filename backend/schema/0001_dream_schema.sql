-- Migration number: 0001_dream       2025-04-15T15:26:00.000Z
-- Dream Mastery Application Database Schema

-- Dream journals table
CREATE TABLE IF NOT EXISTS dream_journals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  dream_date DATE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  lucidity_level INTEGER NOT NULL DEFAULT 0, -- 0-10 scale
  dream_signs TEXT,
  techniques_used TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Dream tags table
CREATE TABLE IF NOT EXISTS dream_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dream_id INTEGER NOT NULL,
  tag_name TEXT NOT NULL,
  FOREIGN KEY (dream_id) REFERENCES dream_journals(id) ON DELETE CASCADE
);

-- Practice sessions table
CREATE TABLE IF NOT EXISTS practice_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  protocol_type TEXT NOT NULL, -- 'reality_manifestation', 'synchronicity', 'intention_amplification', 'dream_navigation'
  protocol_name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  notes TEXT,
  effectiveness_rating INTEGER, -- 1-10 scale
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Progress metrics table
CREATE TABLE IF NOT EXISTS progress_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  lucid_dreams INTEGER NOT NULL DEFAULT 0,
  practice_minutes INTEGER NOT NULL DEFAULT 0,
  consistency_score REAL NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Audio resources table
CREATE TABLE IF NOT EXISTS audio_resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  protocol_type TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_dream_journals_user_id ON dream_journals(user_id);
CREATE INDEX idx_dream_journals_dream_date ON dream_journals(dream_date);
CREATE INDEX idx_dream_tags_dream_id ON dream_tags(dream_id);
CREATE INDEX idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_protocol_type ON practice_sessions(protocol_type);
CREATE INDEX idx_progress_metrics_user_id ON progress_metrics(user_id);
CREATE INDEX idx_progress_metrics_date ON progress_metrics(date);
CREATE INDEX idx_audio_resources_protocol_type ON audio_resources(protocol_type);
