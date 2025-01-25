import { useState } from 'react';
import { CheckSquare, Plus, X } from 'lucide-react';
import { Task, Checklist, ChecklistItem } from '../../types/board';
import { useBoardStore } from '../../store/useBoardStore';

interface TaskChecklistsProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => Promise<void>;
}

export function TaskChecklists({ task, onUpdate }: TaskChecklistsProps) {
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');

  const handleAddChecklist = async () => {
    if (!newChecklistTitle.trim()) return;

    const newChecklist: Checklist = {
      id: crypto.randomUUID(),
      title: newChecklistTitle,
      items: []
    };

    await onUpdate({
      checklists: [...task.checklists, newChecklist]
    });

    setNewChecklistTitle('');
    setIsAddingChecklist(false);
  };

  const handleToggleItem = async (checklistId: string, itemId: string) => {
    const newChecklists = task.checklists.map(checklist => {
      if (checklist.id === checklistId) {
        return {
          ...checklist,
          items: checklist.items.map(item => {
            if (item.id === itemId) {
              return { ...item, checked: !item.checked };
            }
            return item;
          })
        };
      }
      return checklist;
    });

    await onUpdate({ checklists: newChecklists });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <CheckSquare size={16} /> Checklists
        </h3>
        <button
          onClick={() => setIsAddingChecklist(true)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Plus size={16} />
        </button>
      </div>

      {isAddingChecklist && (
        <div className="border rounded p-3 space-y-2">
          <input
            type="text"
            value={newChecklistTitle}
            onChange={(e) => setNewChecklistTitle(e.target.value)}
            placeholder="Checklist title"
            className="w-full px-2 py-1 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAddingChecklist(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleAddChecklist}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {task.checklists.map((checklist) => (
        <div key={checklist.id} className="border rounded p-3 space-y-2">
          <h4 className="font-medium">{checklist.title}</h4>
          <div className="space-y-1">
            {checklist.items.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleItem(checklist.id, item.id)}
                  className="rounded"
                />
                <span className={item.checked ? 'line-through text-gray-500' : ''}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}