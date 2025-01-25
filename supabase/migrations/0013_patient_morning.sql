/*
  # Simplified Board Access
  
  1. Changes
    - Create materialized view for board access
    - Simplify RLS policies to absolute minimum
    - Remove nested queries completely
    - Use materialized view for access checks
  
  2. Performance
    - Materialized view refreshes automatically via trigger
    - Indexed for fast lookups
    - No recursive policy checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "boards_owner_all" ON boards;
DROP POLICY IF EXISTS "boards_member_read" ON boards;
DROP POLICY IF EXISTS "board_members_read_own" ON board_members;
DROP POLICY IF EXISTS "board_members_read_as_owner" ON board_members;
DROP POLICY IF EXISTS "board_members_write_as_owner" ON board_members;
DROP POLICY IF EXISTS "board_members_delete_as_owner" ON board_members;

-- Create materialized view for board access
CREATE MATERIALIZED VIEW board_access AS
SELECT DISTINCT
    b.id as board_id,
    b.user_id as owner_id,
    COALESCE(bm.user_id, b.user_id) as user_id,
    CASE 
        WHEN b.user_id = COALESCE(bm.user_id, b.user_id) THEN 'owner'
        ELSE 'member'
    END as role
FROM boards b
LEFT JOIN board_members bm ON b.id = bm.board_id;

CREATE UNIQUE INDEX board_access_lookup ON board_access(board_id, user_id);
CREATE INDEX board_access_user ON board_access(user_id);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_board_access()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY board_access;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to refresh the view
CREATE TRIGGER refresh_board_access_on_board_change
    AFTER INSERT OR UPDATE OR DELETE ON boards
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_board_access();

CREATE TRIGGER refresh_board_access_on_member_change
    AFTER INSERT OR UPDATE OR DELETE ON board_members
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_board_access();

-- Simple board policies using materialized view
CREATE POLICY "board_access_policy"
    ON boards FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM board_access
            WHERE board_id = id
            AND user_id = auth.uid()
        )
    );

-- Simple board members policies
CREATE POLICY "board_members_access_policy"
    ON board_members FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM board_access
            WHERE board_id = board_id
            AND user_id = auth.uid()
            AND role = 'owner'
        )
    );

-- Ensure RLS is enabled
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT ON board_access TO authenticated;