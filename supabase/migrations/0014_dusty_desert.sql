/*
  # Simplify board access policies

  1. Changes
    - Remove materialized view approach
    - Create simple, direct policies for boards and members
    - Add necessary indexes for performance

  2. Security
    - Enable RLS on all tables
    - Ensure proper access control for board owners and members
*/

-- Drop existing complex policies and views
DROP MATERIALIZED VIEW IF EXISTS board_access CASCADE;
DROP TRIGGER IF EXISTS refresh_board_access_on_board_change ON boards;
DROP TRIGGER IF EXISTS refresh_board_access_on_member_change ON board_members;
DROP FUNCTION IF EXISTS refresh_board_access();

-- Drop all existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "board_access_policy" ON boards;
    DROP POLICY IF EXISTS "board_members_access_policy" ON board_members;
    DROP POLICY IF EXISTS "boards_owner_all" ON boards;
    DROP POLICY IF EXISTS "boards_member_read" ON boards;
END $$;

-- Create simple board policies
CREATE POLICY "boards_owner_access"
ON boards FOR ALL
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "boards_member_read"
ON boards FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM board_members
        WHERE board_members.board_id = id
        AND board_members.user_id = auth.uid()
    )
);

-- Create simple board member policies
CREATE POLICY "board_members_owner_access"
ON board_members FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM boards
        WHERE boards.id = board_members.board_id
        AND boards.user_id = auth.uid()
    )
);

CREATE POLICY "board_members_self_read"
ON board_members FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Ensure RLS is enabled
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Create optimized indexes
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards(user_id);
CREATE INDEX IF NOT EXISTS idx_board_members_board_user ON board_members(board_id, user_id);