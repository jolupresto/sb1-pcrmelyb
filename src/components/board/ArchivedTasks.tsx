import { useState } from 'react';
import { Archive, X } from 'lucide-react';
import { Task } from '../../types/board';
import { useBoardStore } from '../../store/useBoardStore';

interface ArchivedTasksProps {
  onClose: () => void;
}

export function ArchivedTasks({ onClose }: ArchivedTasksProps) {
  const board = useBoardStore(state => state.board);
  const updateTask = useBoardStore(state => state.updateTask);

  const archivedTasks = board?.columns
    .flatMap(col => col.tasks)
    .filter(task => task.archived) ?? [];

  const handleRestore = async (taskId: string) => {
    await updateTask(taskId, { archived: false });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[640px] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Archive size={20} />
            Archived Tasks
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {archivedTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No archived tasks
            </p>
          ) : (
            archivedTasks.map((task) => (
              <div
                key={task.id}
                className="border rounded p-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRestore(task.id)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}