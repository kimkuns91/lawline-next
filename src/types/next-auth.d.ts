import 'next-auth';

declare module 'next-auth' {
  interface User {
    _id: string;
    email: string;
    name: string;
    profileImg: string;
    role: string;
    provider: string;
    createdAt: Date;
    emailVerified: Date;
  }
  interface Profile {
    properties: {
      nickname: string;
      profile_image: string;
    };
    kakao_account: {
      email: string;
    };
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      role: string;
      provider: string;
    };
    accessToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}