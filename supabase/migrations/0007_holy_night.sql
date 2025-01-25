/*
  # Add board name and description
  
  1. Changes
    - Add name and description columns to boards table
    - Add indexes for better performance
    - Update policies for board access
*/

-- Add new columns to boards table
ALTER TABLE boards 
ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT 'Untitled Board',
ADD COLUMN IF NOT EXISTS description text;

-- Add index for board search
CREATE INDEX IF NOT EXISTS idx_boards_name ON boards(name);

-- Update board policies
CREATE POLICY "Users can view boards they are members of"
  ON boards FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.board_id = id
      AND board_members.user_id = auth.uid()
    )
  );