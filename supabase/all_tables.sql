-- =============================================
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- Safe to re-run: uses IF NOT EXISTS everywhere
-- =============================================

-- 1. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS feedback (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reference       text UNIQUE NOT NULL,
  created_at      timestamptz DEFAULT now(),
  last_updated_at timestamptz DEFAULT now(),
  type            text NOT NULL,
  topics          text[] DEFAULT '{}',
  area            text,
  area_other      text,
  message         text NOT NULL,
  email           text,
  name            text,
  status          text DEFAULT 'Received',
  public_notes    text
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'feedback' AND policyname = 'Anyone can insert feedback'
  ) THEN
    CREATE POLICY "Anyone can insert feedback" ON feedback FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'feedback' AND policyname = 'Anyone can read feedback'
  ) THEN
    CREATE POLICY "Anyone can read feedback" ON feedback FOR SELECT USING (true);
  END IF;
END $$;


-- 2. RESERVATIONS TABLE (for Facilities form)
CREATE TABLE IF NOT EXISTS reservations (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  timestamptz DEFAULT now(),
  name        text NOT NULL,
  email       text NOT NULL,
  organisation text,
  facility    text NOT NULL,
  date        date NOT NULL,
  start_time  text NOT NULL,
  end_time    text NOT NULL,
  notes       text
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reservations' AND policyname = 'Anyone can insert reservations'
  ) THEN
    CREATE POLICY "Anyone can insert reservations" ON reservations FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reservations' AND policyname = 'Anyone can read reservations'
  ) THEN
    CREATE POLICY "Anyone can read reservations" ON reservations FOR SELECT USING (true);
  END IF;
END $$;


-- 3. CONTACT MESSAGES TABLE (replaces localStorage)
CREATE TABLE IF NOT EXISTS contact_messages (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reference   text UNIQUE NOT NULL,
  created_at  timestamptz DEFAULT now(),
  name        text NOT NULL,
  email       text NOT NULL,
  topic       text NOT NULL,
  message     text NOT NULL
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'Anyone can insert contact messages'
  ) THEN
    CREATE POLICY "Anyone can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
  END IF;
END $$;


-- 4. MAP PINS TABLE
CREATE TABLE IF NOT EXISTS map_pins (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lat        double precision NOT NULL,
  lng        double precision NOT NULL,
  message    text NOT NULL CHECK (char_length(message) BETWEEN 3 AND 500),
  category   text DEFAULT 'thought',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_map_pins_coords ON map_pins (lat, lng);

ALTER TABLE map_pins ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'map_pins' AND policyname = 'Anyone can read pins'
  ) THEN
    CREATE POLICY "Anyone can read pins" ON map_pins FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'map_pins' AND policyname = 'Anyone can insert pins'
  ) THEN
    CREATE POLICY "Anyone can insert pins" ON map_pins FOR INSERT WITH CHECK (true);
  END IF;
END $$;


-- 5. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          text UNIQUE NOT NULL,
  title         text NOT NULL,
  status        text NOT NULL DEFAULT 'Idea',
  topics        text[] DEFAULT '{}',
  area          text NOT NULL,
  description   text NOT NULL,
  last_updated  date DEFAULT now(),
  body          text[] DEFAULT '{}',
  milestones    jsonb DEFAULT '[]',
  team          text[] DEFAULT '{}',
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Anyone can read projects'
  ) THEN
    CREATE POLICY "Anyone can read projects" ON projects FOR SELECT USING (true);
  END IF;
END $$;
