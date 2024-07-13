import NextAuth from "next-auth/next";
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from "@/database";

export default NextAuth({
    providers: [
        Credentials({
            name: 'Custom Login',
            credentials: {
                email: { label: "Correo:", type: "email", placeholder: "correo@correo.com"},
                password: { label: "Contraseña:", type: "password", placeholder: "********" }
            },
            async authorize(credentials){
                return await dbUsers.checkUserEmailPassowrd(credentials!.email, credentials!.password) as any;
            }
        }), 
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
        })
    ],
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register',
    },
    session: {
        maxAge: 2592000, // 3d
        updateAge: 86400, // 1d
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({token, account, user}) {
            if (account) {
                token.accessToken = account.access_token;
                switch (account.type) {
                    case 'oauth': 
                        token.user = await dbUsers.oAuthToDBUser(user?.email || '', user?.name || '')
                        break;

                    case 'credentials':
                        token.user = user;
                        break;
                }
            }
            return token
        },

        async session({session, token, user}) {
            session.accessToken = token.accessToken as string;
            session.user = token.user as any;
            return session
        }
    }
});
