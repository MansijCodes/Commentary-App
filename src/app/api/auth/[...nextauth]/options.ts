import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            //throw new Error('No user found with this email');
            throw JSON.stringify({
              message: 'No user found with this username or email',
            });
          }
          if (!user.isVerified) {
            //throw new Error("Please verify your account before login");
            throw JSON.stringify({
              message: 'Please verify your account before login',
              username: user.username,
            });
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            //throw new Error('Incorrect Password')
            throw JSON.stringify({ message: 'Incorrect Password' });
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error);
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token._isAcceptingMessage = user.isAcceptingMessage;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 1day
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
