import { Calendar } from 'lucide-react';
import { Task } from '../../types/board';

interface TaskDueDateProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => Promise<void>;
}

export function TaskDueDate({ task, onUpdate }: TaskDueDateProps) {
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await onUpdate({ dueDate: e.target.value });
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium flex items-center gap-2">
        <Calendar size={16} /> Due Date
      </h3>
      <input
        type="datetime-local"
        value={task.dueDate || ''}
        onChange={handleDateChange}
        className="w-full px-3 py-2 border rounded"
      />
    </div>
  );
}