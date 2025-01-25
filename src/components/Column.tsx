import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Task } from './Task';
import { AddTask } from './AddTask';
import { useBoardStore } from '../store/useBoardStore';
import { MoreVertical, Pencil, Trash2, X } from 'lucide-react';
import type { Column as ColumnType } from '../types/board';

interface ColumnProps {
  column: ColumnType;
}

export function Column({ column }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  const updateColumn = useBoardStore((state) => state.updateColumn);
  const deleteColumn = useBoardStore((state) => state.deleteColumn);
  const addTask = useBoardStore((state) => state.addTask);

  const handleSaveTitle = async () => {
    try {
      await updateColumn(column.id, title);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving column title:', error);
    }
  };

  const handleAddTask = async (taskTitle: string) => {
    await addTask(column.id, taskTitle);
  };

  return (
    <div className="bg-gray-100/90 backdrop-blur-sm w-80 rounded-lg flex flex-col">
      <div className="p-3 font-medium flex items-center justify-between">
        {isEditing ? (
          <div className="flex-1 flex items-center">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded px-2 py-1 w-full mr-2"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              autoFocus
            />
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <span>{column.title}</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => deleteColumn(column.id)}
                className="text-gray-500 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
              <MoreVertical size={16} className="text-gray-500" />
            </div>
          </>
        )}
      </div>

      <div className="flex-1 p-3 space-y-3">
        <SortableContext
          items={column.tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              columnId={column.id}
            />
          ))}
        </SortableContext>

        <AddTask onAdd={handleAddTask} />
      </div>
    </div>
  );
}