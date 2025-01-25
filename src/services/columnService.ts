import { supabase } from '../lib/supabase';
import type { Column } from '../types/board';

export async function createColumn(boardId: string, title: string, position: number): Promise<Column> {
  const { data, error } = await supabase
    .from('columns')
    .insert({
      board_id: boardId,
      title,
      position
    })
    .select('*')
    .single();

  if (error) {
    console.error('Database error creating column:', error);
    throw new Error('Failed to create column');
  }

  if (!data) {
    throw new Error('No data returned from column creation');
  }

  return { ...data, tasks: [] };
}

export async function updateColumn(columnId: string, title: string): Promise<void> {
  const { error } = await supabase
    .from('columns')
    .update({ title })
    .eq('id', columnId);

  if (error) {
    console.error('Database error updating column:', error);
    throw new Error('Failed to update column');
  }
}

export async function deleteColumn(columnId: string): Promise<void> {
  const { error } = await supabase
    .from('columns')
    .delete()
    .eq('id', columnId);

  if (error) {
    console.error('Database error deleting column:', error);
    throw new Error('Failed to delete column');
  }
}