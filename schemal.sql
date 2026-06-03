CREATE TABLE IF NOT EXISTS notes(
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    body        TEXT DEFAULT '',
    create_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);