import { Plus } from 'lucide-react';
import { useBoardStore } from '../../store/useBoardStore';

export function AddColumnButton() {
  const addColumn = useBoardStore(state => state.addColumn);

  const handleAddColumn = () => {
    const title = prompt('Enter column title');
    if (title) {
      addColumn(title);
    }
  };

  return (
    <button
      onClick={handleAddColumn}
      className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 h-fit"
    >
      <Plus className="inline-block mr-2" size={16} />
      Add Column
    </button>
  );
}