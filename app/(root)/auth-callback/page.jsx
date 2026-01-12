"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/lib/AuthContext';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { checkAuth } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncSession = async () => {
      console.log('Auth callback - Status:', status);
      console.log('Auth callback - Session:', session);

      if (status === 'loading') {
        console.log('Still loading session...');
        return;
      }

      if (status === 'unauthenticated') {
        console.error('User is not authenticated');
        setError('Authentication failed');
        setTimeout(() => router.replace('/login'), 2000);
        return;
      }

      if (session && session.user) {
        console.log('Session found, syncing...');
        try {
          // Sync NextAuth session with our custom auth cookie
          const response = await fetch('/api/auth/sync-session', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log('Sync response status:', response.status);
          const data = await response.json();
          console.log('Sync response data:', data);

          if (data.success) {
            console.log('Session synced successfully, updating auth context...');
            
            // Update auth context
            await checkAuth();
            
            console.log('Auth context updated, redirecting to dashboard...');
            
            // Use replace instead of push to avoid back button issues
            // Redirect based on role
            if (data.user.role === 'admin') {
              router.replace('/admin/dashboard');
            } else {
              router.replace('/user/dashboard');
            }
          } else {
            console.error('Failed to sync session:', data.error);
            setError(data.error || 'Failed to sync session');
            setTimeout(() => router.replace('/login'), 2000);
          }
        } catch (err) {
          console.error('Sync error:', err);
          setError('An error occurred during authentication');
          setTimeout(() => router.replace('/login'), 2000);
        }
      }
    };

    syncSession();
  }, [session, status, router, checkAuth]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg border border-white/20 max-w-md w-full text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bebas text-white mb-2">Authentication Failed</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg border border-white/20 max-w-md w-full text-center">
        <div className="mb-4">
          <Spinner className="w-16 h-16 mx-auto" />
        </div>
        <h2 className="text-2xl font-bebas text-white mb-2">Setting up your account...</h2>
        <p className="text-gray-300">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
}
