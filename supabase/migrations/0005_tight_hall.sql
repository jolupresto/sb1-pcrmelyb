/*
  # Add Kanban board features

  1. New Tables
    - `labels`
      - `id` (uuid, primary key)
      - `board_id` (uuid, references boards)
      - `name` (text)
      - `color` (text)
    - `task_labels`
      - `task_id` (uuid, references tasks)
      - `label_id` (uuid, references labels)
    - `checklists`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `title` (text)
    - `checklist_items`
      - `id` (uuid, primary key)
      - `checklist_id` (uuid, references checklists)
      - `title` (text)
      - `checked` (boolean)
      - `position` (integer)
    - `comments`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `user_id` (uuid, references auth.users)
      - `content` (text)
      - `created_at` (timestamptz)
    - `attachments`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `name` (text)
      - `url` (text)
      - `created_at` (timestamptz)
    - `board_members`
      - `board_id` (uuid, references boards)
      - `user_id` (uuid, references auth.users)
      - `role` (text)

  2. Modify Existing Tables
    - Add to `tasks`:
      - `due_date` (timestamptz)
      - `priority` (text)
      - `archived` (boolean)

  3. Security
    - Enable RLS on all new tables
    - Add policies for board members
*/

-- Add new columns to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date timestamptz;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority text;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;

-- Create labels table
CREATE TABLE labels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid REFERENCES boards ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create task_labels junction table
CREATE TABLE task_labels (
  task_id uuid REFERENCES tasks ON DELETE CASCADE NOT NULL,
  label_id uuid REFERENCES labels ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (task_id, label_id)
);

-- Create checklists table
CREATE TABLE checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create checklist_items table
CREATE TABLE checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id uuid REFERENCES checklists ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  checked boolean DEFAULT false,
  position integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create attachments table
CREATE TABLE attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create board_members table
CREATE TABLE board_members (
  board_id uuid REFERENCES boards ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (board_id, user_id)
);

-- Enable RLS
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Board members can manage labels"
  ON labels FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.board_id = labels.board_id
      AND board_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Board members can manage task labels"
  ON task_labels FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN columns ON columns.id = tasks.column_id
      JOIN boards ON boards.id = columns.board_id
      JOIN board_members ON board_members.board_id = boards.id
      WHERE task_labels.task_id = tasks.id
      AND board_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Board members can manage checklists"
  ON checklists FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN columns ON columns.id = tasks.column_id
      JOIN boards ON boards.id = columns.board_id
      JOIN board_members ON board_members.board_id = boards.id
      WHERE checklists.task_id = tasks.id
      AND board_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Board members can manage checklist items"
  ON checklist_items FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM checklists
      JOIN tasks ON tasks.id = checklists.task_id
      JOIN columns ON columns.id = tasks.column_id
      JOIN boards ON boards.id = columns.board_id
      JOIN board_members ON board_members.board_id = boards.id
      WHERE checklist_items.checklist_id = checklists.id
      AND board_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Board members can manage comments"
  ON comments FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN columns ON columns.id = tasks.column_id
      JOIN boards ON boards.id = columns.board_id
      JOIN board_members ON board_members.board_id = boards.id
      WHERE comments.task_id = tasks.id
      AND board_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Board members can manage attachments"
  ON attachments FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN columns ON columns.id = tasks.column_id
      JOIN boards ON boards.id = columns.board_id
      JOIN board_members ON board_members.board_id = boards.id
      WHERE attachments.task_id = tasks.id
      AND board_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their board memberships"
  ON board_members FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Add indexes for better performance
CREATE INDEX idx_task_labels_task_id ON task_labels(task_id);
CREATE INDEX idx_task_labels_label_id ON task_labels(label_id);
CREATE INDEX idx_checklists_task_id ON checklists(task_id);
CREATE INDEX idx_checklist_items_checklist_id ON checklist_items(checklist_id);
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_attachments_task_id ON attachments(task_id);
CREATE INDEX idx_board_members_board_id ON board_members(board_id);
CREATE INDEX idx_board_members_user_id ON board_members(user_id);