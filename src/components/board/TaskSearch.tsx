import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Task } from '../../types/board';
import { useBoardStore } from '../../store/useBoardStore';

export function TaskSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Task[]>([]);
  const board = useBoardStore(state => state.board);

  useEffect(() => {
    if (!query.trim() || !board) {
      setResults([]);
      return;
    }

    const searchTasks = () => {
      const allTasks = board.columns.flatMap(col => col.tasks);
      const filtered = allTasks.filter(task => 
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    };

    searchTasks();
  }, [query, board]);

  return (
    <div className="relative">
      <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg">
        <Search size={20} className="text-white ml-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks..."
          className="bg-transparent text-white placeholder-white/70 px-3 py-2 w-64 focus:outline-none"
        />
      </div>

      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((task) => (
            <div
              key={task.id}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            >
              <h4 className="font-medium">{task.title}</h4>
              {task.description && (
                <p className="text-sm text-gray-500 truncate">
                  {task.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}