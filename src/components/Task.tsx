import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Task as TaskType } from '../types/board';
import { useBoardStore } from '../store/useBoardStore';
import { cn } from '../lib/utils';

interface TaskProps {
  task: TaskType;
  columnId: string;
}

export function Task({ task, columnId }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const updateTask = useBoardStore((state) => state.updateTask);
  const deleteTask = useBoardStore((state) => state.deleteTask);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    updateTask(task.id, { title, description });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteTask(columnId, task.id);
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white p-3 rounded-lg shadow-sm space-y-2"
      >
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-2 py-1 w-full mr-2"
            placeholder="Task title"
          />
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-2 py-1 w-full resize-none"
          rows={3}
          placeholder="Task description"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'bg-white p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50'
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
        </div>
        <div className="flex space-x-2 ml-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}