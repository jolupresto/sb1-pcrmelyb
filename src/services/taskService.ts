import { supabase } from '../lib/supabase';
import type { Task } from '../types/board';

export async function createTask(columnId: string, title: string, position: number): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      column_id: columnId,
      title,
      position,
      description: ''
    })
    .select('*')
    .single();

  if (error) {
    console.error('Database error creating task:', error);
    throw new Error('Failed to create task');
  }

  if (!data) {
    throw new Error('No data returned from task creation');
  }

  return data;
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId);

  if (error) {
    console.error('Database error updating task:', error);
    throw new Error('Failed to update task');
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Database error deleting task:', error);
    throw new Error('Failed to delete task');
  }
}