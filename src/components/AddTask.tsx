import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddTaskProps {
  onAdd: (title: string) => Promise<void>;
}

export function AddTask({ onAdd }: AddTaskProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      setError(null);
      await onAdd(title);
      setTitle('');
      setIsAdding(false);
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex items-center text-gray-500 hover:text-gray-700"
      >
        <Plus size={16} className="mr-1" /> Add task
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Enter task title"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />
        <button
          onClick={() => setIsAdding(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsAdding(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </div>
  );
}