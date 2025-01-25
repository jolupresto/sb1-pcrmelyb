import { supabase } from '../lib/supabase';
import type { Label } from '../types/board';

export async function createLabel(boardId: string, name: string, color: string): Promise<Label> {
  const { data, error } = await supabase
    .from('labels')
    .insert({ board_id: boardId, name, color })
    .select()
    .single();

  if (error) throw new Error('Failed to create label');
  return data;
}

export async function deleteLabel(labelId: string): Promise<void> {
  const { error } = await supabase
    .from('labels')
    .delete()
    .eq('id', labelId);

  if (error) throw new Error('Failed to delete label');
}