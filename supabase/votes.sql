-- =============================================
-- Add voting to map_pins
-- Run this in Supabase SQL Editor AFTER all_tables.sql
-- Safe to re-run
-- =============================================

-- Add votes column if it doesn't exist
ALTER TABLE map_pins ADD COLUMN IF NOT EXISTS votes integer DEFAULT 0;

-- Allow anonymous updates (for voting)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'map_pins' AND policyname = 'Anyone can update pin votes'
  ) THEN
    CREATE POLICY "Anyone can update pin votes" ON map_pins FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

-- RPC function to atomically increment votes (prevents race conditions)
CREATE OR REPLACE FUNCTION increment_pin_votes(pin_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_votes integer;
BEGIN
  UPDATE map_pins
  SET votes = COALESCE(votes, 0) + 1
  WHERE id = pin_id
  RETURNING votes INTO new_votes;

  RETURN new_votes;
END;
$$;
