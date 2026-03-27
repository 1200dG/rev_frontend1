import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { decodeJWT, signInAction, socialLoginAction } from "@/lib/services/authActions";
import { JWTPayload, NextAuthOptions, User } from "next-auth";
import { SocialSignInData } from "@/lib/types/common/types";
import { envVars } from "config";
import { handleApiError } from "@/lib/errorHandler";
import { AxiosError } from "axios";
import { errorMonitor } from "events";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;
        try {
          const response = await signInAction(credentials);
          const { access_token, refresh_token, user } = response?.data.data;

          if (access_token) {
            const userData = {
              id: "",
              email: user.email,
              username: user.username,
              access_token: access_token,
              refresh_token: refresh_token,
              account_id: user.account_id,
              role: user.role || "USER",
            };
            return userData;
          }
          return null;
        } catch (error) {
            let message = "Invalid email or password. Please try again.";
            if (error && typeof error === "object" && "response" in error) {
              const axiosError = error as  AxiosError<{
                errors?: { detail?: string };
                message?: string;
              }>;
              message =
                axiosError.response?.data?.errors?.detail ||
                axiosError.response?.data?.message ||
                message;
            }
            throw new Error(message);
          }
      },
    }),
    GoogleProvider({
      clientId: envVars.googleClientId || "",
      clientSecret: envVars.googleClientSecret || "",
    }),
    FacebookProvider({
      clientId: envVars.facebookClientId || "",
      clientSecret: envVars.facebookClientSecret || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: envVars.nextAuthSecret,
  callbacks: {
    async signIn({ user, account  }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          const response = await socialLoginAction(user as SocialSignInData);
          const { access, refresh, user: apiUser } = response?.data;
          if (access && refresh) {
            const payload = decodeJWT<JWTPayload>(access);
            user.id = apiUser.id?.toString(); 
            user.username = apiUser.username;
            user.email = apiUser.email;
            user.role = apiUser.role || "USER";
            user.account_id = payload?.account_id || apiUser.account_id;
            user.access_token = access;
            user.refresh_token = refresh;
            user.credits = apiUser.credits;
            user.lives = apiUser.lives;
          }

        } catch (error) {
          handleApiError(error, "Social login failed. Please try again.");
          throw error;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.access_token = user.access_token;
        token.email = user.email;
        token.refresh_token = user.refresh_token;
        token.account_id = user.account_id;
        token.role = user.role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        username: token.username || "",
        access_token: token.access_token || "",
        email: token.email || "",
        refresh_token: token.refresh_token || "",
        account_id: token.account_id || "",
        role: token.role || "USER",
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
};
