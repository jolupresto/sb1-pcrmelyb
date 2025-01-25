import { supabase } from '../lib/supabase';
import type { Attachment } from '../types/board';

export async function uploadAttachment(
  taskId: string,
  file: File
): Promise<Attachment> {
  const fileName = `${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(fileName, file);

  if (uploadError) throw new Error('Failed to upload file');

  const { data: urlData } = supabase.storage
    .from('attachments')
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('attachments')
    .insert({
      task_id: taskId,
      name: file.name,
      url: urlData.publicUrl
    })
    .select()
    .single();

  if (error) throw new Error('Failed to save attachment');
  return data;
}

export async function deleteAttachment(attachmentId: string): Promise<void> {
  const { error } = await supabase
    .from('attachments')
    .delete()
    .eq('id', attachmentId);

  if (error) throw new Error('Failed to delete attachment');
}