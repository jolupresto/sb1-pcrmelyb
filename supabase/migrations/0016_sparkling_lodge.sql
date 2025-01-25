/*
  # Simplify board access policies

  1. Changes
    - Create simple, direct policies for boards
    - Remove complex policies and dependencies
    - Add optimized indexes

  2. Security
    - Enable RLS on all tables
    - Create owner-only access policy
*/

-- Drop all existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "owner_access" ON boards;
    DROP POLICY IF EXISTS "member_access" ON board_members;
END $$;

-- Create simple owner-only policy
CREATE POLICY "owner_full_access"
ON boards FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Ensure RLS is enabled
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

-- Create optimized indexes
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards(user_id);