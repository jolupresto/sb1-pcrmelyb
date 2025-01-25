import { useState } from 'react';
import { Tag, Plus } from 'lucide-react';
import { Task, Label } from '../../types/board';
import { useBoardStore } from '../../store/useBoardStore';

interface TaskLabelsProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => Promise<void>;
}

export function TaskLabels({ task, onUpdate }: TaskLabelsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const board = useBoardStore((state) => state.board);

  const handleAddLabel = async (labelId: string) => {
    const newLabels = [...task.labels, board!.labels.find(l => l.id === labelId)!];
    await onUpdate({ labels: newLabels });
    setIsAdding(false);
  };

  const handleRemoveLabel = async (labelId: string) => {
    const newLabels = task.labels.filter(l => l.id !== labelId);
    await onUpdate({ labels: newLabels });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <Tag size={16} /> Labels
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {task.labels.map((label) => (
          <span
            key={label.id}
            className="px-2 py-1 rounded text-sm text-white flex items-center gap-1"
            style={{ backgroundColor: label.color }}
          >
            {label.name}
            <button
              onClick={() => handleRemoveLabel(label.id)}
              className="hover:text-gray-200"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {isAdding && (
        <div className="border rounded p-2 space-y-2">
          {board?.labels.map((label) => (
            <button
              key={label.id}
              onClick={() => handleAddLabel(label.id)}
              className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <span
                className="w-4 h-4 rounded"
                style={{ backgroundColor: label.color }}
              />
              {label.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}