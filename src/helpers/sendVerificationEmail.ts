import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email:string,username:string,verifycode:string):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mssgsent | verification code',
            react: VerificationEmail({username,otp:verifycode}),
          });
        return {success:true,message:"success sending verification email"}

        
    } catch (error) {
        console.error("error sending verification email",error);
        return {success:false,message:"failed sending verification email"}
    }
}