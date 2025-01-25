import { useEffect, useState } from 'react';
import { Board } from './components/Board';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.clear();
    
    const initializeAuth = async () => {
      try {
        await supabase.auth.signOut();
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <Board userId={user.id} />;
}