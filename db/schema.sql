-- TripXtrem — Schema inicial
-- Ejecutar en Neon console (https://console.neon.tech/) con el DATABASE_URL del proyecto.

-- ════════════════════════════════════════════
-- WAITLIST (usuarios interesados en reservar)
-- ════════════════════════════════════════════
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

CREATE TABLE IF NOT EXISTS waitlist_attempts (
  ip_hash VARCHAR(64) NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_attempts_ip_time ON waitlist_attempts(ip_hash, attempted_at DESC);

-- ════════════════════════════════════════════
-- PROVIDERS (empresas de deportes extremos)
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS providers (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(80) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  legal_name VARCHAR(200),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  website VARCHAR(255),
  country VARCHAR(2) NOT NULL DEFAULT 'ES',
  region VARCHAR(120),
  city VARCHAR(120),
  description TEXT,
  logo_url VARCHAR(500),
  business_id VARCHAR(80),                      -- NIF/CIF/VAT/Tax ID
  insurance_doc_url VARCHAR(500),
  verified BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending',         -- pending, approved, rejected, suspended
  approved_at TIMESTAMPTZ,
  approved_by VARCHAR(120),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_providers_status ON providers(status);
CREATE INDEX IF NOT EXISTS idx_providers_country ON providers(country);
CREATE INDEX IF NOT EXISTS idx_providers_slug ON providers(slug);

-- ════════════════════════════════════════════
-- EXPERIENCES (actividades de cada provider)
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES providers(id) ON DELETE CASCADE,
  slug VARCHAR(160) UNIQUE NOT NULL,
  sport VARCHAR(64) NOT NULL,                   -- SURF, KITESURF, PARACAIDISMO, ...
  category VARCHAR(16) NOT NULL,                -- Agua, Aire, Nieve, Tierra
  icon VARCHAR(16),                             -- emoji
  title VARCHAR(200),
  description TEXT,
  location VARCHAR(200),                        -- "Zarautz, País Vasco"
  country VARCHAR(2) NOT NULL DEFAULT 'ES',
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  difficulty VARCHAR(16),                       -- Baja, Media, Alta
  duration VARCHAR(64),
  price_eur NUMERIC(10,2),
  old_price_eur NUMERIC(10,2),
  spots INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  extras JSONB,                                 -- ["Neopreno","Tabla","Instructor"]
  badge VARCHAR(16),                            -- hot, new, popular, null
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT experiences_category_check CHECK (category IN ('Agua','Aire','Nieve','Tierra'))
);

CREATE INDEX IF NOT EXISTS idx_experiences_active ON experiences(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_experiences_category ON experiences(category);
CREATE INDEX IF NOT EXISTS idx_experiences_sport ON experiences(sport);
CREATE INDEX IF NOT EXISTS idx_experiences_provider ON experiences(provider_id);
CREATE INDEX IF NOT EXISTS idx_experiences_country ON experiences(country);

-- ════════════════════════════════════════════
-- PARTNER APPLICATIONS (solicitudes nuevos partners)
-- ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS partner_applications (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(200) NOT NULL,
  contact_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  website VARCHAR(255),
  country VARCHAR(2) NOT NULL,
  city VARCHAR(120),
  categories TEXT,                              -- comma-separated: Agua,Aire
  sports TEXT,                                  -- comma-separated: SURF,KITESURF
  description TEXT,
  has_insurance BOOLEAN DEFAULT false,
  years_operating INTEGER,
  status VARCHAR(20) DEFAULT 'new',             -- new, contacted, converted, rejected
  ip_hash VARCHAR(64),
  gdpr_consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_apps_status ON partner_applications(status);
CREATE INDEX IF NOT EXISTS idx_partner_apps_country ON partner_applications(country);
CREATE INDEX IF NOT EXISTS idx_partner_apps_created ON partner_applications(created_at DESC);
