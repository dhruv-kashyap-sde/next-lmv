import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        // Check if user exists
        let existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          // Update existing user if they didn't have Google linked
          if (!existingUser.providerId && account.provider === 'google') {
            existingUser.provider = 'google';
            existingUser.providerId = account.providerAccountId;
            existingUser.image = user.image;
            existingUser.emailVerified = true;
            await existingUser.save();
          }
          // If user exists but signed up with different provider
          else if (existingUser.provider !== 'google' && account.provider === 'google') {
            existingUser.provider = 'google';
            existingUser.providerId = account.providerAccountId;
            existingUser.image = user.image;
            existingUser.emailVerified = true;
            await existingUser.save();
          }
        } else {
          // Create new user
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            provider: account.provider,
            providerId: account.providerAccountId,
            image: user.image,
            emailVerified: true,
            role: 'user',
          });
        }

        // Store user ID in the user object for JWT callback
        user.dbId = existingUser._id.toString();
        user.role = existingUser.role;

        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (user && account) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          
          if (dbUser) {
            token.userId = dbUser._id.toString();
            token.role = dbUser.role;
            token.provider = account.provider;
          }
        } catch (error) {
          console.error('JWT callback error:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.provider = token.provider;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to our custom callback page to sync session
      if (url.startsWith(baseUrl)) {
        // If it's already our callback, allow it
        if (url.includes('/auth-callback')) {
          return url;
        }
        return `${baseUrl}/auth-callback`;
      }
      // Default redirect to auth callback
      return `${baseUrl}/auth-callback`;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 6 * 60 * 60, // 6 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user, account, profile }) {
      // This event is triggered after successful sign-in
      console.log('User signed in:', user.email);
    },
  },
});

export { handler as GET, handler as POST };
