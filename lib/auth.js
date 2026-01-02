import { NextResponse } from 'next/server';
import { verifyToken } from './jwt';

export function withAuth(handler, options = {}) {
  return async (request, context) => {
    try {
      // Get token from cookies
      const token = request.cookies.get('auth_token')?.value;

      if (!token) {
        console.log("token not found");
        
        return NextResponse.json(
          { error: 'Authentication required, could not find token' },
          { status: 401 }
        );
      }

      // Verify token
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Check role if required
      if (options.requiredRole && decoded.role !== options.requiredRole) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Attach user info to request
      request.user = decoded;

      // Call the actual handler
      return handler(request, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

export function setAuthCookie(response, token) {
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 6 * 60 * 60, // 6 hours
    path: '/',
  });
  return response;
}

export function clearAuthCookie(response) {
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
