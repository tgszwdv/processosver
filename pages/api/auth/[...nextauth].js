import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Obtém a lista de emails permitidos do ambiente
      const allowedEmails = [
        process.env.EMAIL1,
        process.env.EMAIL2
      ];

      // Verifica se o email do usuário está na lista permitida
      if (allowedEmails.includes(user.email)) {
        return true;
      } else {
        return false; // Bloqueia o login para outros emails
      }
    }
  },
});
