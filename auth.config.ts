/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import axiosInstance from "./lib/axios";


export  const authConfig :NextAuthConfig = {
  secret: "thisisrandomsecret",
  providers: [
    CredentialProvider({
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          const response = await axiosInstance.post("/auth/admin/signin", {
            email,
            password,
          });
          if (response?.data?.statusCode == 201) {
            return {
              id: response?.data?.user?.id,
              email: response?.data?.user?.email,
              username: response?.data?.user?.username,
              token: response?.data?.token,
            };
          } else {
            throw new Error(response?.data?.message);
          }
        } catch (error: any) {
          throw new Error(error.message || "Invalid credentials");
        }
      },
    }),
  ],
  callbacks:{

    jwt(params) {
        if(params.user){
            params.token.user = params.user;
        }

        return params.token;
    },
    session(params:any) {
        if(params.token?.user){
            params.session.user = params.token.user;
        }

        return params.session;
    },
  },
 trustHost: true,
}
