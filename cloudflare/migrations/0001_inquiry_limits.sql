CREATE TABLE IF NOT EXISTS inquiry_limits (
  key TEXT PRIMARY KEY NOT NULL,
  hits TEXT NOT NULL CHECK (json_valid(hits)),
  expires INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS inquiry_limits_expiry ON inquiry_limits(expires);
