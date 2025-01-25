import { useState, useRef } from 'react';
import { Paperclip, X } from 'lucide-react';
import { Task } from '../../types/board';
import { uploadAttachment, deleteAttachment } from '../../services/attachmentService';

interface TaskAttachmentsProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => Promise<void>;
}

export function TaskAttachments({ task, onUpdate }: TaskAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const attachment = await uploadAttachment(task.id, file);
      await onUpdate({
        attachments: [...task.attachments, attachment]
      });
    } catch (error) {
      console.error('Error uploading attachment:', error);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    try {
      await deleteAttachment(attachmentId);
      await onUpdate({
        attachments: task.attachments.filter(a => a.id !== attachmentId)
      });
    } catch (error) {
      console.error('Error deleting attachment:', error);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium flex items-center gap-2">
        <Paperclip size={16} /> Attachments
      </h3>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full px-3 py-2 border rounded text-center hover:bg-gray-50"
      >
        Add Attachment
      </button>

      <div className="space-y-2">
        {task.attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between border rounded p-2"
          >
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {attachment.name}
            </a>
            <button
              onClick={() => handleDelete(attachment.id)}
              className="text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}