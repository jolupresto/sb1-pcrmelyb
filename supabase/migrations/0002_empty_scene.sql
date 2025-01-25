/*
  # Add Row Level Security Policies

  1. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own boards
    - Add policies for users to manage columns in their boards
    - Add policies for users to manage tasks in their boards' columns
*/

-- Enable RLS
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can manage their own boards" ON boards;
  DROP POLICY IF EXISTS "Users can manage columns in their boards" ON columns;
  DROP POLICY IF EXISTS "Users can manage tasks in their boards" ON tasks;
END $$;

CREATE POLICY "Users can manage their own boards"
  ON boards
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage columns in their boards"
  ON columns
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = columns.board_id 
      AND boards.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = columns.board_id 
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage tasks in their boards"
  ON tasks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM columns 
      JOIN boards ON boards.id = columns.board_id 
      WHERE columns.id = tasks.column_id 
      AND boards.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM columns 
      JOIN boards ON boards.id = columns.board_id 
      WHERE columns.id = tasks.column_id 
      AND boards.user_id = auth.uid()
    )
  );