"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    checkAuth();
  }, []);

  // Also update user when NextAuth session changes
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        image: session.user.image,
      });
    }
  }, [session]);

  const checkAuth = async () => {
    try {
      console.log('AuthContext: Checking authentication...');
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      console.log('AuthContext: /api/auth/me response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('AuthContext: User authenticated:', data.user);
        
        setUser(data.user);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('AuthContext: Authentication failed:', errorData);
        setUser(null);
      }
    } catch (error) {
      console.error('AuthContext: Error checking auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Sign out from NextAuth if using OAuth
      await signOut({ redirect: false });
      
      // Also logout from custom JWT auth
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
