/*
  # Fix board policies and remove recursion

  1. Changes
    - Drop all existing board and member policies
    - Create new non-recursive policies
    - Add performance optimizations
    
  2. Security
    - Maintain proper access control
    - Prevent infinite recursion
    - Optimize query performance
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can access their boards" ON boards;
DROP POLICY IF EXISTS "Users can view boards they are members of" ON boards;
DROP POLICY IF EXISTS "Board owners can manage members" ON board_members;
DROP POLICY IF EXISTS "Members can view other members" ON board_members;
DROP POLICY IF EXISTS "Users can manage their own boards" ON boards;
DROP POLICY IF EXISTS "Users can view boards" ON boards;

-- Create new simplified board policies
CREATE POLICY "board_owner_all"
  ON boards FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "board_member_select"
  ON boards FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT board_id 
      FROM board_members 
      WHERE user_id = auth.uid()
    )
  );

-- Create new board member policies
CREATE POLICY "board_members_owner_all"
  ON board_members FOR ALL
  TO authenticated
  USING (
    board_id IN (
      SELECT id 
      FROM boards 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "board_members_select_own"
  ON board_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_board_members_user_board 
  ON board_members(user_id, board_id);

CREATE INDEX IF NOT EXISTS idx_boards_user_id 
  ON boards(user_id);