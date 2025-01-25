import { supabase } from '../lib/supabase';
import type { Comment } from '../types/board';

export async function addComment(taskId: string, content: string): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert({ task_id: taskId, content })
    .select()
    .single();

  if (error) throw new Error('Failed to add comment');
  return data;
}

export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw new Error('Failed to delete comment');
}