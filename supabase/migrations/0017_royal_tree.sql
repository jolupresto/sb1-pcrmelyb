/*
  # Simplify board access to owner-only

  1. Changes
    - Drop existing policy
    - Create new owner-only policy
    - Drop unused tables and columns
    - Add single board per user constraint

  2. Security
    - Enable RLS
    - Add owner-only policy
*/

-- Drop existing policy first
DROP POLICY IF EXISTS "owner_full_access" ON boards;

-- Drop unused tables and columns
DROP TABLE IF EXISTS board_members CASCADE;
ALTER TABLE boards
DROP COLUMN IF EXISTS name,
DROP COLUMN IF EXISTS description;

-- Function to keep only the most recently created board per user
CREATE OR REPLACE FUNCTION cleanup_duplicate_boards()
RETURNS void AS $$
BEGIN
    -- Create temporary table to store boards to keep
    CREATE TEMP TABLE boards_to_keep AS
    SELECT DISTINCT ON (user_id) id
    FROM boards
    ORDER BY user_id, created_at DESC;

    -- Delete boards that aren't the most recent for each user
    DELETE FROM boards
    WHERE id NOT IN (SELECT id FROM boards_to_keep);

    -- Drop temporary table
    DROP TABLE boards_to_keep;
END;
$$ LANGUAGE plpgsql;

-- Clean up existing data
SELECT cleanup_duplicate_boards();

-- Drop cleanup function
DROP FUNCTION cleanup_duplicate_boards();

-- Now safe to add unique constraint
ALTER TABLE boards
ADD CONSTRAINT single_board_per_user UNIQUE (user_id);

-- Enable RLS
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

-- Create new owner-only policy
CREATE POLICY "owner_full_access"
ON boards FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards(user_id);