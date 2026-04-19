-- TripXtrem — Schema inicial
-- Ejecutar en Neon console (https://console.neon.tech/) con el DATABASE_URL del proyecto.

CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  activity VARCHAR(64),
  postal_code VARCHAR(10),
  source VARCHAR(64) DEFAULT 'landing',
  ip_hash VARCHAR(64),
  user_agent VARCHAR(255),
  gdpr_consent BOOLEAN NOT NULL DEFAULT false,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_activity ON waitlist(activity);
CREATE INDEX IF NOT EXISTS idx_waitlist_postal_code ON waitlist(postal_code);

-- Rate limiting (simple, por IP hash + ventana de 1h)
CREATE TABLE IF NOT EXISTS waitlist_attempts (
  ip_hash VARCHAR(64) NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_attempts_ip_time ON waitlist_attempts(ip_hash, attempted_at DESC);
