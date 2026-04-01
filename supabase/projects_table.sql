-- =============================================
-- Projects table for City Factory
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- Safe to re-run: uses IF NOT EXISTS everywhere
-- =============================================

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


-- =============================================
-- Seed data (your existing hardcoded projects)
-- Uses ON CONFLICT to avoid duplicates on re-run
-- =============================================

INSERT INTO projects (slug, title, status, topics, area, description, last_updated, body, milestones, team)
VALUES
  (
    'leppavaara-station-area-development',
    'Leppävaara Station Area Development',
    'Planning',
    ARRAY['Transport', 'Housing'],
    'Leppävaara',
    'Redesigning the area around Leppävaara station to improve pedestrian access, add housing, and create new public spaces.',
    '2024-03-01',
    ARRAY[
      'Leppävaara is one of Espoo''s busiest hubs. This project explores changes around the station to make walking and cycling easier, improve public space, and support new homes near transit.',
      'City Factory is collecting resident experiences about bottlenecks, safety, and what kinds of places people want to spend time in — before plans are finalized.'
    ],
    '[{"date":"2024-02-10","label":"Initial idea and site walk"},{"date":"2024-03-01","label":"Concept planning begins"},{"date":"2024-04-15","label":"Resident workshop (planned)"}]'::jsonb,
    ARRAY['Transport', 'Urban Planning', 'Housing']
  ),
  (
    'school-route-safety-audit',
    'School Route Safety Audit',
    'Research',
    ARRAY['Transport', 'Safety', 'Education'],
    'All Espoo',
    'Mapping and evaluating walking and cycling routes to schools across Espoo, identifying areas that need safety improvements.',
    '2024-02-01',
    ARRAY[
      'Safe routes matter for independence and wellbeing. This audit gathers observations from families, schools, and city teams about crossings, visibility, winter maintenance, and traffic speed near school areas.',
      'Results will guide future pilots and investments, and will be shared openly on this platform.'
    ],
    '[{"date":"2024-01-20","label":"Data collection starts"},{"date":"2024-02-01","label":"Survey analysis underway"},{"date":"2024-03-20","label":"Findings summary (planned)"}]'::jsonb,
    ARRAY['Transport', 'Education', 'Safety']
  ),
  (
    'tapiola-central-park-renewal',
    'Tapiola Central Park Renewal',
    'Testing',
    ARRAY['Environment', 'Culture'],
    'Tapiola',
    'Testing new playground equipment and gathering resident feedback on park improvements before full renovation.',
    '2024-03-10',
    ARRAY[
      'Before renovating the whole park, we''re testing a few changes on a smaller scale — and asking residents what works (and what doesn''t).',
      'This is a chance to shape the final plan: accessibility, play, lighting, seating, nature protection, and spaces for culture.'
    ],
    '[{"date":"2024-02-25","label":"Pilot equipment installed"},{"date":"2024-03-10","label":"On-site feedback sessions"},{"date":"2024-05-01","label":"Decision on final design (planned)"}]'::jsonb,
    ARRAY['Parks', 'Culture', 'Accessibility']
  ),
  (
    'senior-digital-services-pilot',
    'Senior Digital Services Pilot',
    'Implementation',
    ARRAY['Health', 'Education'],
    'Espoonlahti',
    'Providing in-person support for elderly residents to access digital city services. Pilot running at Espoonlahti library.',
    '2024-01-15',
    ARRAY[
      'Many city services are digital — but not everyone feels confident using them. This pilot offers calm, in-person help for common tasks, without judgment.',
      'We''re learning what kinds of support are most useful and how to scale it across neighborhoods.'
    ],
    '[{"date":"2023-12-10","label":"Pilot planning completed"},{"date":"2024-01-15","label":"Pilot launched"},{"date":"2024-03-30","label":"Evaluation checkpoint (planned)"}]'::jsonb,
    ARRAY['Health', 'Education', 'Libraries']
  ),
  (
    'neighborhood-climate-action-plans',
    'Neighborhood Climate Action Plans',
    'Idea',
    ARRAY['Environment'],
    'All Espoo',
    'Exploring how each Espoo neighborhood could develop its own climate action priorities based on local conditions and resident input.',
    '2024-03-05',
    ARRAY[
      'Climate action works best when it fits local conditions. This idea explores light-weight neighborhood plans shaped by residents, schools, organizations, and city teams.',
      'The goal is practical: pick a few actions that matter locally and track progress together.'
    ],
    '[{"date":"2024-03-05","label":"Idea published for feedback"},{"date":"2024-04-01","label":"First neighborhood roundtable (planned)"}]'::jsonb,
    ARRAY['Environment', 'Community Engagement']
  )
ON CONFLICT (slug) DO NOTHING;
