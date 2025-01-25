/*
  # Final RLS Policy Fix
  
  This migration provides the absolute simplest RLS policies possible:
  1. Uses direct user_id checks only
  2. Eliminates all nested queries
  3. Separates read/write permissions clearly
  4. Uses separate policies for owners and members
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "board_owner_access" ON boards;
DROP POLICY IF EXISTS "board_member_access" ON boards;
DROP POLICY IF EXISTS "board_member_select" ON board_members;
DROP POLICY IF EXISTS "board_member_insert" ON board_members;
DROP POLICY IF EXISTS "board_member_delete" ON board_members;

-- Board Policies
CREATE POLICY "boards_owner_all"
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

-- Board Members Policies
CREATE POLICY "board_members_read_own"
  ON board_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "board_members_read_as_owner"
  ON board_members FOR SELECT
  TO authenticated
  USING (
    board_id IN (
      SELECT id FROM boards
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "board_members_write_as_owner"
  ON board_members FOR INSERT
  TO authenticated
  WITH CHECK (
    board_id IN (
      SELECT id FROM boards
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "board_members_delete_as_owner"
  ON board_members FOR DELETE
  TO authenticated
  USING (
    board_id IN (
      SELECT id FROM boards
      WHERE user_id = auth.uid()
    )
  );

-- Ensure RLS is enabled
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Optimize indexes
DROP INDEX IF EXISTS idx_boards_user_id;
DROP INDEX IF EXISTS idx_board_members_lookup;
DROP INDEX IF EXISTS idx_board_members_user;

CREATE INDEX idx_boards_user_id ON boards(user_id);
CREATE INDEX idx_board_members_board_user ON board_members(board_id, user_id);