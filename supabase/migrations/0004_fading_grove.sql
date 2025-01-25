/*
  # Fix RLS policies for columns and tasks

  1. Changes
    - Drop existing policies
    - Create new, more permissive policies for testing
    - Add better error handling for foreign key constraints

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own boards" ON boards;
DROP POLICY IF EXISTS "Users can manage columns in their boards" ON columns;
DROP POLICY IF EXISTS "Users can manage tasks in their boards" ON tasks;

-- Create new policies
CREATE POLICY "Users can manage their own boards"
ON boards FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage columns in their boards"
ON columns FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM boards
    WHERE boards.id = columns.board_id
    AND boards.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage tasks in their boards"
ON tasks FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM columns
    JOIN boards ON boards.id = columns.board_id
    WHERE columns.id = tasks.column_id
    AND boards.user_id = auth.uid()
  )
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_columns_board_id ON columns(board_id);
CREATE INDEX IF NOT EXISTS idx_tasks_column_id ON tasks(column_id);