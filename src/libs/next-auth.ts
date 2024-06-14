import { randomBytes, randomUUID } from 'crypto';

import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import KakaoProvider from 'next-auth/providers/kakao';
import { v4 as uuidv4 } from 'uuid';
import prisma from './prisma';

// if (
//   !process.env.KAKAO_CLIENT_ID ||
//   !process.env.KAKAO_CLIENT_SECRET ||
//   !process.env.NEXTAUTH_SECRET
// ) {
//   console.error('환경 변수가 설정되지 않았습니다.');
//   process.exit(1);
// }

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const existUser = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });
        if (!existUser) throw new Error('해당 이메일로 가입한 적이 없습니다.');

        if (existUser.provider !== 'credentials')
          throw new Error('카카오 로그인으로 회원가입한 회원입니다.');

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          existUser.password
        );

        if (!passwordMatch) throw new Error('비밀번호 오류 입니다.');

        if (!existUser.emailVerified)
          throw new Error('이메일 인증을 해주세요.');

        return existUser as any;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString('hex');
    },
  },
  callbacks: {
    async signIn({ user, profile, account }) {
      console.log('user : ', user);
      console.log('profile : ', profile);
      console.log('account : ', account);
      try {
        if (account?.provider === 'kakao') {
          console.log('Kakao로 로그인 시도');

          const db_user = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          // 이미 이메일 인증으로 가입한 경우 에러 처리
          if (db_user && db_user.provider === 'credentials') {
            return `/provider-error/${db_user.provider}`
          }

          if (!db_user) {
            const hashedPassword = await bcrypt.hash(uuidv4(), 12);
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                password: hashedPassword,
                profileImg: profile?.properties?.profile_image,
                provider: 'kakao',
              },
            });

            user.id = newUser.id;
            user.profileImg = newUser.profileImg;
            user.role = newUser.role;
            user.provider = newUser.provider;
            return true;
          }

          user.id = db_user.id;
          user.profileImg = db_user.profileImg;
          user.role = db_user.role;
          user.provider = db_user.provider;
          return true;
        }
        if (account?.provider === 'github') {
          const db_user = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          // 이미 이메일 인증으로 가입한 경우 에러 처리
          if (db_user && db_user.provider !== 'github') {
            return `/provider-error/${db_user.provider}`
          }

          if (!db_user) {
            const hashedPassword = await bcrypt.hash(uuidv4(), 12);
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                password: hashedPassword,
                profileImg: user.image!,
                provider: 'github',
              },
            });

            user.id = newUser.id;
            user.profileImg = newUser.profileImg;
            user.role = newUser.role;
            user.provider = newUser.provider;
            return true;
          }

          user.id = db_user.id;
          user.profileImg = db_user.profileImg;
          user.role = db_user.role;
          user.provider = db_user.provider;
          return true;
        }
        return true;
      } catch (error) {
        console.error('로그인 도중 에러가 발생했습니다: ' + error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // console.log('jwt callback :', { token, user });
      if (user) {
        token.id = user.id;
        token.profileImg = user.profileImg;
        token.provider = user.provider;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log('session callback :', { session, token });
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.profileImg as string;
        session.user.role = token.role as Role;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },
};