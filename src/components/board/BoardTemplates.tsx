import { useState } from 'react';
import { Layout, Plus } from 'lucide-react';
import { Board } from '../../types/board';
import { useBoardStore } from '../../store/useBoardStore';

interface BoardTemplatesProps {
  onClose: () => void;
}

export function BoardTemplates({ onClose }: BoardTemplatesProps) {
  const templates = [
    { id: 'scrum', name: 'Scrum Board', columns: ['Backlog', 'To Do', 'In Progress', 'Done'] },
    { id: 'kanban', name: 'Kanban', columns: ['To Do', 'Doing', 'Done'] },
    { id: 'project', name: 'Project Management', columns: ['Planning', 'In Progress', 'Review', 'Complete'] }
  ];

  const addColumn = useBoardStore(state => state.addColumn);

  const handleApplyTemplate = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    // Add columns from template
    for (const columnTitle of template.columns) {
      await addColumn(columnTitle);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[480px] p-6">
        <h2 className="text-xl font-semibold mb-4">Board Templates</h2>
        
        <div className="grid gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleApplyTemplate(template.id)}
              className="flex items-center gap-3 p-4 border rounded hover:bg-gray-50 text-left"
            >
              <Layout className="text-gray-400" />
              <div>
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-gray-500">
                  {template.columns.join(' → ')}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}