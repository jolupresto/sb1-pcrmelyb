import { supabase } from '../lib/supabase';
import type { Board } from '../types/board';

export async function getOrCreateBoard(userId: string): Promise<Board> {
  const { data: boards, error: fetchError } = await supabase
    .from('boards')
    .select(`
      id,
      background,
      columns:columns(
        id,
        title,
        position,
        tasks:tasks(
          id,
          title,
          description,
          position
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error('Error fetching board:', fetchError);
    throw new Error('Failed to fetch board');
  }

  if (!boards || boards.length === 0) {
    const { data: newBoard, error: createError } = await supabase
      .from('boards')
      .insert({ user_id: userId })
      .select()
      .single();

    if (createError) {
      console.error('Error creating board:', createError);
      throw new Error('Failed to create board');
    }

    return {
      ...newBoard,
      columns: [],
      columnOrder: []
    };
  }

  const board = boards[0];
  const columns = board.columns?.map(col => ({
    ...col,
    tasks: col.tasks?.sort((a, b) => a.position - b.position) || []
  })).sort((a, b) => a.position - b.position) || [];

  return {
    ...board,
    columns,
    columnOrder: columns.map(c => c.id)
  };
}

export async function inviteUser(boardId: string, email: string): Promise<void> {
  const { error } = await supabase
    .from('board_members')
    .insert({
      board_id: boardId,
      user_id: email, // This will be replaced with the actual user ID after they accept the invite
      role: 'member'
    });

  if (error) {
    console.error('Error inviting user:', error);
    throw new Error('Failed to invite user');
  }
}

export async function removeMember(boardId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('board_members')
    .delete()
    .match({ board_id: boardId, user_id: userId });

  if (error) {
    console.error('Error removing member:', error);
    throw new Error('Failed to remove member');
  }
}