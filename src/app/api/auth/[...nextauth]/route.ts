// required file for any way of authentication
import NextAuth from "next-auth/next";
import { authOptions } from "./options";
export const config = {
    runtime: "edge",
  };

const handler=NextAuth(authOptions)

// as this is framework we need to export it as GET and POST  verbs  not as route handler because it will not work
export {handler as GET,handler as POST}