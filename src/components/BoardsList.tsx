import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';

interface BoardsListProps {
  onBoardSelect: (boardId: string) => void;
}

export function BoardsList({ onBoardSelect }: BoardsListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const { boards, fetchBoards, createBoard, loading, error } = useBoardStore();

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    
    try {
      const boardId = await createBoard(newBoardName, newBoardDescription);
      setNewBoardName('');
      setNewBoardDescription('');
      setIsCreating(false);
      onBoardSelect(boardId);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-gray-600">Loading boards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Boards</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <Plus size={20} />
            Create Board
          </button>
        </div>

        {isCreating && (
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Board Name
                </label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="Enter board name"
                  className="w-full px-3 py-2 border rounded"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                  placeholder="Enter board description"
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBoard}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => onBoardSelect(board.id)}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <h3 className="text-lg font-semibold mb-2">{board.name}</h3>
              {board.description && (
                <p className="text-gray-600 text-sm">{board.description}</p>
              )}
            </button>
          ))}
        </div>

        {boards.length === 0 && !isCreating && (
          <div className="text-center text-gray-500 mt-8">
            <p>No boards yet. Create your first board to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}