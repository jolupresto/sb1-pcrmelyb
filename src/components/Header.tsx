import { Settings, LogOut, Layout, Users, Archive } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { supabase } from '../lib/supabase';
import { BoardTemplates } from './board/BoardTemplates';
import { BoardShare } from './board/BoardShare';
import { ArchivedTasks } from './board/ArchivedTasks';
import { TaskSearch } from './board/TaskSearch';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-8">
        <Logo />
        <TaskSearch />
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowTemplates(true)}
          className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20"
          title="Templates"
        >
          <Layout size={20} />
        </button>
        <button
          onClick={() => setShowShare(true)}
          className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20"
          title="Share"
        >
          <Users size={20} />
        </button>
        <button
          onClick={() => setShowArchived(true)}
          className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20"
          title="Archived Tasks"
        >
          <Archive size={20} />
        </button>
        <button
          onClick={onSettingsClick}
          className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20"
          title="Settings"
        >
          <Settings size={20} />
        </button>
        <button
          onClick={handleLogout}
          className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>

      {showTemplates && <BoardTemplates onClose={() => setShowTemplates(false)} />}
      {showShare && <BoardShare onClose={() => setShowShare(false)} />}
      {showArchived && <ArchivedTasks onClose={() => setShowArchived(false)} />}
    </div>
  );
}