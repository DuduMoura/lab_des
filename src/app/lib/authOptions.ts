import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { prisma } from "@/src/app/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        let user = await prisma.user.findFirst({
          where: {
            email: credentials?.email
          }
        })
        if (user) {
          return {
            id: String(user.id),
            name: user.nome,
            email: user.email,
          };
        }
    
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" as const },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      try {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              nome: user.name,
              email: user.email,
              foto: user.image
            },
          });
        }
        return true;
      } catch (error) {
        console.error("Erro ao salvar usuário:", error);
        return false;
      }
    },
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = token.user as any;

      const user = await prisma.user.findUnique({
        where: { email: (token.user as any).email as string },
      });
      session.user.id = String(user!.id)
      return session;
    },
  },
};