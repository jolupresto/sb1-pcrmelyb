import { useState } from 'react';
import { Users, X } from 'lucide-react';
import { UserSearch } from './UserSearch';
import { supabase } from '../../lib/supabase';
import { useBoardStore } from '../../store/useBoardStore';

interface BoardShareProps {
  onClose: () => void;
}

export function BoardShare({ onClose }: BoardShareProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const board = useBoardStore(state => state.board);

  const handleInviteUser = async (user: any) => {
    if (!board) return;
    
    try {
      setError(null);
      setSuccess(null);

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('board_members')
        .select('*')
        .eq('board_id', board.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        setError('User is already a member of this board');
        return;
      }

      // Add user as board member
      const { error: memberError } = await supabase
        .from('board_members')
        .insert({
          board_id: board.id,
          user_id: user.id,
          role: 'member'
        });

      if (memberError) throw memberError;

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-board-invite', {
        body: {
          to: user.email,
          boardId: board.id,
          inviterName: `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
        }
      });

      if (emailError) throw emailError;

      setSuccess(`Invitation sent to ${user.email}`);
    } catch (err) {
      console.error('Error inviting user:', err);
      setError('Failed to invite user');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!board) return;
    
    try {
      const { error } = await supabase
        .from('board_members')
        .delete()
        .eq('board_id', board.id)
        .eq('user_id', userId);

      if (error) throw error;

      // Refresh board members list
      useBoardStore.getState().initialize(board.id);
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove member');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[480px] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users size={20} />
            Share Board
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <UserSearch onSelect={handleInviteUser} />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          {/* Members List */}
          <div className="space-y-2">
            <h3 className="font-medium">Board Members</h3>
            <div className="space-y-2">
              {board?.members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="font-medium">
                      {member.firstName} {member.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </div>
                  {member.role !== 'owner' && (
                    <button
                      onClick={() => handleRemoveMember(member.userId)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}