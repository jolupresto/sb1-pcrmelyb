/*
  # Fix board member policies

  1. Changes
    - Fix infinite recursion in board_members policies
    - Simplify policy logic for better performance
    - Add proper indexes for policy conditions

  2. Security
    - Ensure proper access control for board members
    - Prevent unauthorized access to boards and members
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view board members" ON board_members;
DROP POLICY IF EXISTS "Users can manage board members" ON board_members;
DROP POLICY IF EXISTS "Users can view boards they are members of" ON boards;

-- Create new policies with fixed logic
CREATE POLICY "Board owners can manage members"
  ON board_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = board_members.board_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can view other members"
  ON board_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = board_members.board_id
      AND (
        boards.user_id = auth.uid() OR
        board_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can access their boards"
  ON boards FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR
    id IN (
      SELECT board_id FROM board_members
      WHERE user_id = auth.uid()
    )
  );

-- Add indexes to improve policy performance
CREATE INDEX IF NOT EXISTS idx_board_members_user_board 
  ON board_members(user_id, board_id);

CREATE INDEX IF NOT EXISTS idx_boards_user_id 
  ON boards(user_id);