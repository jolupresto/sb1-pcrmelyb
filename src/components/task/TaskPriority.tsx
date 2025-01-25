import { AlertCircle } from 'lucide-react';
import { Task } from '../../types/board';

interface TaskPriorityProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => Promise<void>;
}

export function TaskPriority({ task, onUpdate }: TaskPriorityProps) {
  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-2">
      <h3 className="font-medium flex items-center gap-2">
        <AlertCircle size={16} /> Priority
      </h3>
      <div className="flex gap-2">
        {priorities.map(({ value, label, color }) => (
          <button
            key={value}
            onClick={() => onUpdate({ priority: value as Task['priority'] })}
            className={`px-3 py-1 rounded text-white ${color} ${
              task.priority === value ? 'ring-2 ring-offset-2' : 'opacity-75 hover:opacity-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}