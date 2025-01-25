/*
  # Create Boards Schema
  
  1. New Tables
    - boards
      - id (uuid, primary key)
      - background (text)
      - created_at (timestamp)
      - user_id (uuid, references auth.users)
    - columns
      - id (uuid, primary key) 
      - board_id (uuid, references boards)
      - title (text)
      - position (integer)
      - created_at (timestamp)
    - tasks
      - id (uuid, primary key)
      - column_id (uuid, references columns)
      - title (text)
      - description (text)
      - position (integer)
      - created_at (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create tables
CREATE TABLE boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  background text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

CREATE TABLE columns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid REFERENCES boards ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  position integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id uuid REFERENCES columns ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  position integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
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