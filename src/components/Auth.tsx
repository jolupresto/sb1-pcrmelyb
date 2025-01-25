import { useState } from 'react';
import { SignUpForm } from './auth/SignUpForm';
import { SignInForm } from './auth/SignInForm';
import { ForgotPasswordForm } from './auth/ForgotPasswordForm';

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center" 
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1682686581030-7fa4ea2b96c3)' }}
      >
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg w-96">
          <ForgotPasswordForm onBack={() => setIsForgotPassword(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1682686581030-7fa4ea2b96c3)' }}
    >
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Boardly</h2>
        
        {isSignUp ? (
          <SignUpForm onToggle={() => setIsSignUp(false)} />
        ) : (
          <>
            <SignInForm 
              onError={setError} 
              setLoading={setLoading}
              onForgotPassword={() => setIsForgotPassword(true)}
            />
            <p className="text-sm text-center mt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                Sign up
              </button>
            </p>
            {error && (
              <p className="text-red-600 text-sm mt-4">{error}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}