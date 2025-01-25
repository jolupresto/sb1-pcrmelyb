import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface User {
  id: string;
  email: string;
  user_metadata: {
    first_name: string;
    last_name: string;
  };
}

interface UserSearchProps {
  onSelect: (user: User) => void;
}

export function UserSearch({ onSelect }: UserSearchProps) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setUsers([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, user_metadata')
          .or(`email.ilike.%${query}%,user_metadata->first_name.ilike.%${query}%,user_metadata->last_name.ilike.%${query}%`)
          .limit(5);

        if (error) throw error;
        setUsers(data as User[]);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative">
      <div className="flex items-center border rounded-lg overflow-hidden">
        <Search size={20} className="text-gray-400 ml-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full px-3 py-2 focus:outline-none"
        />
      </div>

      {loading && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg p-2">
          Loading...
        </div>
      )}

      {users.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelect(user)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50"
            >
              <div className="font-medium">
                {user.user_metadata.first_name} {user.user_metadata.last_name}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}