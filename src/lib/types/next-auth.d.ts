import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    username?: string;
    access_token?: string;
    email?: string;
    refresh_token?: string;
    account_id?: string;
    credits?: number;
    lives?: number;
    role?: string;
  }

  interface JWTPayload {
  account_id?: string;
  [key: string]: unknown;
  }
  interface Session {
    user: {
      id?: string;
      username?: string;
      access_token?: string;
      email?: string;
      refresh_token?: string;
      account_id?: string;
      credits?: number;
      lives?: number;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    access_token?: string;
    email?: string;
    refresh_token?: string;
    account_id?: string;
    credits?: number;
    lives?: number;
    role?: string;
  }
}
