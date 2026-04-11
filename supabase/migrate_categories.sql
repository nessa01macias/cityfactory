-- Migrate map pin categories: 5 → 3
-- Run this in Supabase SQL Editor for the City Factory project

-- Update default category
ALTER TABLE map_pins ALTER COLUMN category SET DEFAULT 'idea';

-- Migrate old pins to new categories
UPDATE map_pins SET category = 'idea' WHERE category IN ('thought', 'love', 'memory');
