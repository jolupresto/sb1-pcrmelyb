/*
  # Fix board access policies

  1. Changes
    - Remove complex policies
    - Create simple, direct policies for boards and members
    - Add necessary indexes for performance

  2. Security
    - Enable RLS on all tables
    - Create separate policies for owners and members
    - Ensure proper access control
*/

-- Drop all existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "boards_owner_access" ON boards;
    DROP POLICY IF EXISTS "boards_member_read" ON boards;
    DROP POLICY IF EXISTS "board_members_owner_access" ON board_members;
    DROP POLICY IF EXISTS "board_members_self_read" ON board_members;
END $$;

-- Create simple board policies
CREATE POLICY "owner_access"
ON boards FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Create simple board member policies
CREATE POLICY "member_access"
ON board_members FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM boards
        WHERE boards.id = board_members.board_id
        AND boards.user_id = auth.uid()
    )
);

-- Ensure RLS is enabled
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Create optimized indexes
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards(user_id);
CREATE INDEX IF NOT EXISTS idx_board_members_board_user ON board_members(board_id, user_id);