import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Task, Comment } from '../../types/board';
import { useBoardStore } from '../../store/useBoardStore';

interface TaskCommentsProps {
  task: Task;
}

export function TaskComments({ task }: TaskCommentsProps) {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    // Add comment logic here
    setNewComment('');
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        <MessageSquare size={16} /> Comments
      </h3>

      <div className="space-y-4">
        {task.comments.map((comment) => (
          <div key={comment.id} className="border rounded p-3">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>User</span>
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="w-full px-3 py-2 border rounded"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddComment}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
}