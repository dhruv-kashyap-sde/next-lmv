"use client";
import { useAuth } from '@/lib/AuthContext';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AuthTestPage() {
  const { user, loading } = useAuth();
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bebas text-white mb-8">
          Authentication Test Page
        </h1>

        {/* Custom Auth Context */}
        <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
          <h2 className="text-2xl font-bebas text-white mb-4">
            Custom Auth Context
          </h2>
          <div className="space-y-2 text-white">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? 'Authenticated' : 'Not authenticated'}</p>
            {user && (
              <>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>ID:</strong> {user.id}</p>
                {user.image && (
                  <div>
                    <strong>Image:</strong>
                    <img 
                      src={user.image} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full mt-2"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* NextAuth Session */}
        <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
          <h2 className="text-2xl font-bebas text-white mb-4">
            NextAuth Session
          </h2>
          <div className="space-y-2 text-white">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
            {session?.user && (
              <>
                <p><strong>Name:</strong> {session.user.name}</p>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Role:</strong> {session.user.role}</p>
                <p><strong>ID:</strong> {session.user.id}</p>
                {session.user.image && (
                  <div>
                    <strong>Image:</strong>
                    <img 
                      src={session.user.image} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full mt-2"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Cookies Check */}
        <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
          <h2 className="text-2xl font-bebas text-white mb-4">
            Cookie Status
          </h2>
          <div className="space-y-2 text-white">
            <p className="text-sm">Check browser DevTools → Application → Cookies</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>auth_token (custom JWT cookie)</li>
              <li>next-auth.session-token (NextAuth cookie)</li>
            </ul>
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
          <h2 className="text-2xl font-bebas text-white mb-4">
            Quick Actions
          </h2>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.href = '/login'}
              variant="brand"
            >
              Go to Login
            </Button>
            <Button 
              onClick={() => window.location.href = '/signup'}
              variant="brand"
            >
              Go to Signup
            </Button>
            {user && (
              <>
                <Button 
                  onClick={() => window.location.href = '/user/dashboard'}
                  variant="outline"
                  className="text-white border-white/20"
                >
                  User Dashboard
                </Button>
                {user.role === 'admin' && (
                  <Button 
                    onClick={() => window.location.href = '/admin/dashboard'}
                    variant="outline"
                    className="text-white border-white/20"
                  >
                    Admin Dashboard
                  </Button>
                )}
              </>
            )}
          </div>
        </Card>

        {/* API Test */}
        <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
          <h2 className="text-2xl font-bebas text-white mb-4">
            API Test
          </h2>
          <Button 
            onClick={async () => {
              const res = await fetch('/api/auth/me', { credentials: 'include' });
              const data = await res.json();
              alert(JSON.stringify(data, null, 2));
            }}
            variant="outline"
            className="text-white border-white/20"
          >
            Test /api/auth/me
          </Button>
        </Card>
      </div>
    </div>
  );
}
