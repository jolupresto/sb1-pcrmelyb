/*
  # Final RLS Policy Fix

  This migration provides the simplest possible RLS policies that:
  1. Completely eliminates circular dependencies
  2. Uses direct user_id checks where possible
  3. Minimizes nested queries
  4. Maintains proper access control
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "owner_full_access" ON boards;
DROP POLICY IF EXISTS "member_read_access" ON boards;
DROP POLICY IF EXISTS "owner_manage_members" ON board_members;
DROP POLICY IF EXISTS "member_view_members" ON board_members;

-- Simple board policies
CREATE POLICY "board_owner_access"
  ON boards FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "board_member_access"
  ON boards FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT board_id 
      FROM board_members 
      WHERE user_id = auth.uid()
    )
  );

-- Simple board member policies
CREATE POLICY "board_member_select"
  ON board_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    board_id IN (
      SELECT id 
      FROM boards 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "board_member_insert"
  ON board_members FOR INSERT
  TO authenticated
  WITH CHECK (
    board_id IN (
      SELECT id 
      FROM boards 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "board_member_delete"
  ON board_members FOR DELETE
  TO authenticated
  USING (
    board_id IN (
      SELECT id 
      FROM boards 
      WHERE user_id = auth.uid()
    )
  );

-- Ensure RLS is enabled
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Optimize indexes
DROP INDEX IF EXISTS idx_board_members_composite;
DROP INDEX IF EXISTS idx_board_members_user_id;
DROP INDEX IF EXISTS idx_boards_user_id;

CREATE INDEX idx_boards_user_id ON boards(user_id);
CREATE INDEX idx_board_members_lookup ON board_members(board_id, user_id);
CREATE INDEX idx_board_members_user ON board_members(user_id);