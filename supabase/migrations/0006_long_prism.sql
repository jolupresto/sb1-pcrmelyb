/*
  # Board Sharing Enhancement

  1. Views
    - Add user_search view for searching users by name and email
  
  2. Functions
    - Add search_users function for user lookup
  
  3. Policies
    - Add policies for board member management
*/

-- Drop existing objects if they exist
DROP VIEW IF EXISTS user_search;
DROP FUNCTION IF EXISTS search_users;

-- Create view for user search
CREATE VIEW user_search AS
SELECT 
  id,
  email,
  raw_user_meta_data->>'first_name' as first_name,
  raw_user_meta_data->>'last_name' as last_name
FROM auth.users;

-- Create function for searching users
CREATE FUNCTION search_users(search_query TEXT)
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.id,
    us.email,
    us.first_name,
    us.last_name
  FROM user_search us
  WHERE 
    us.email ILIKE '%' || search_query || '%' OR
    us.first_name ILIKE '%' || search_query || '%' OR
    us.last_name ILIKE '%' || search_query || '%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION search_users TO authenticated;
GRANT SELECT ON user_search TO authenticated;

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view board members" ON board_members;
  DROP POLICY IF EXISTS "Users can manage board members" ON board_members;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies
DO $$ 
BEGIN
  -- Policy for viewing board members
  CREATE POLICY "Users can view board members"
    ON board_members FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM boards
        WHERE boards.id = board_members.board_id
        AND (
          boards.user_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM board_members bm
            WHERE bm.board_id = boards.id
            AND bm.user_id = auth.uid()
          )
        )
      )
    );

  -- Policy for managing board members
  CREATE POLICY "Users can manage board members"
    ON board_members FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM boards
        WHERE boards.id = board_members.board_id
        AND boards.user_id = auth.uid()
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM boards
        WHERE boards.id = board_members.board_id
        AND boards.user_id = auth.uid()
      )
    );
END $$;