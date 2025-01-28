// required file for any way of authentication 


// all work of auth can be done in the route file

import{
    NextAuthOptions
} from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

// import { getProviders } from "next-auth/react";

export const authOptions:NextAuthOptions={
   
    providers:[
        CredentialsProvider({
           
             name:"Credentials",
             credentials:{
                 email:{label:"Email",type:"text"},
                 password:{label:"password",type:"text",placeholder:"password"},
             },
             async authorize(credentials:any):Promise<any>{
                 await dbConnect();
               try {
                  const user=await UserModel.findOne({
                     $or:[{email:credentials.email}],
                  })
                  if (!user){
                     throw new Error("User not found")
                  }
                 if (!user.isverified){
                    throw new Error("User not verified")
                 }
                 const isPasswordMatched=await bcrypt.compare(credentials.password,user.password)
                 if (!isPasswordMatched){
                    throw new Error("Password not matched")
                 }
                 return user
                  
               } catch (error:any) {
                    console.error("the error is ",error)
                    throw new Error("something went wrong",error)
               }
             }
        }),
    ],
    // this provides not to call the database multiple times we can get info from the token or sessions
    callbacks:{
        
        //   the user is from the provider section returned value
        
          async jwt({ token, user }) {
           
            if (user){
                // we have defined a type for id in type next-auth.d.ts file
                // we have add more fields to the token to avoid calling to database
                token._id=user._id?.toString()
                token.isverified=user.isverified
                token.isacceptingmssg=user.isacceptingmssg
                token.username=user.username

            } return token
          },
          async session({ session,  token }) {
            if(token){
                session.user._id=token._id
                session.user.isverified=token.isverified
                session.user.isacceptingmssg=token.isacceptingmssg
                session.user.username=token.username
            }
            return session
          },
    },

    // automatically created by nextjs
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET,

}