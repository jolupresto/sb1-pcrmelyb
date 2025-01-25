import { useState } from 'react';
import { X } from 'lucide-react';
import { Task } from '../../types/board';
import { TaskLabels } from './TaskLabels';
import { TaskDueDate } from './TaskDueDate';
import { TaskPriority } from './TaskPriority';
import { TaskChecklists } from './TaskChecklists';
import { TaskComments } from './TaskComments';
import { TaskAttachments } from './TaskAttachments';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (updates: Partial<Task>) => Promise<void>;
}

export function TaskModal({ task, onClose, onUpdate }: TaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSave = async () => {
    await onUpdate({ title, description });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg w-[768px] max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Task Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="w-full text-xl font-semibold px-2 py-1 border rounded"
          />

          {/* Main content area */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left column - Main content */}
            <div className="col-span-2 space-y-6">
              <div className="space-y-2">
                <label className="font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleSave}
                  rows={4}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Add a description..."
                />
              </div>

              <TaskChecklists task={task} onUpdate={onUpdate} />
              <TaskComments task={task} />
            </div>

            {/* Right column - Metadata */}
            <div className="space-y-6">
              <TaskLabels task={task} onUpdate={onUpdate} />
              <TaskDueDate task={task} onUpdate={onUpdate} />
              <TaskPriority task={task} onUpdate={onUpdate} />
              <TaskAttachments task={task} onUpdate={onUpdate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}