import { FcGoogle } from 'react-icons/fc';
import { supabase } from '../../lib/supabase';

interface GoogleButtonProps {
  onError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  disabled?: boolean;
}

export function GoogleButton({ onError, setLoading, disabled }: GoogleButtonProps) {
  const handleGoogleSignIn = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      onError(error.message);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={disabled}
      className="w-full flex items-center justify-center space-x-2 border border-gray-300 bg-white py-2 px-4 rounded-md hover:bg-gray-50"
    >
      <FcGoogle className="w-5 h-5" />
      <span>Google</span>
    </button>
  );
}