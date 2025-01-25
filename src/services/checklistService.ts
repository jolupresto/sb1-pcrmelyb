import { supabase } from '../lib/supabase';
import type { Checklist, ChecklistItem } from '../types/board';

export async function createChecklist(taskId: string, title: string): Promise<Checklist> {
  const { data, error } = await supabase
    .from('checklists')
    .insert({ task_id: taskId, title })
    .select()
    .single();

  if (error) throw new Error('Failed to create checklist');
  return { ...data, items: [] };
}

export async function addChecklistItem(
  checklistId: string,
  title: string,
  position: number
): Promise<ChecklistItem> {
  const { data, error } = await supabase
    .from('checklist_items')
    .insert({ checklist_id: checklistId, title, position })
    .select()
    .single();

  if (error) throw new Error('Failed to add checklist item');
  return data;
}

export async function toggleChecklistItem(itemId: string, checked: boolean): Promise<void> {
  const { error } = await supabase
    .from('checklist_items')
    .update({ checked })
    .eq('id', itemId);

  if (error) throw new Error('Failed to toggle checklist item');
}