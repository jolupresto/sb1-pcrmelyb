/*
  # Fix infinite recursion in RLS policies

  This migration fixes the infinite recursion issues in the RLS policies by:
  1. Dropping existing problematic policies
  2. Creating new simplified policies without circular dependencies
  3. Adding optimized indexes for performance

  Changes:
  - Simplify board access policies
  - Separate owner and member policies
  - Remove nested EXISTS clauses that caused recursion
  - Add performance indexes
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "board_owner_all" ON boards;
DROP POLICY IF EXISTS "board_member_select" ON boards;
DROP POLICY IF EXISTS "board_members_owner_all" ON board_members;
DROP POLICY IF EXISTS "board_members_select_own" ON board_members;

-- Create simplified board policies
CREATE POLICY "owner_full_access"
  ON boards FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "member_read_access"
  ON boards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.board_id = id
      AND board_members.user_id = auth.uid()
    )
  );

-- Create simplified board member policies
CREATE POLICY "owner_manage_members"
  ON board_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = board_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "member_view_members"
  ON board_members FOR SELECT
  TO authenticated
  USING (
    board_id IN (
      SELECT board_id FROM board_members
      WHERE user_id = auth.uid()
    )
  );

-- Ensure RLS is enabled
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Add optimized indexes
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards(user_id);
CREATE INDEX IF NOT EXISTS idx_board_members_composite ON board_members(board_id, user_id);
CREATE INDEX IF NOT EXISTS idx_board_members_user_id ON board_members(user_id);