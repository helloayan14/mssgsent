//the api folder has to be named api as nextjs served api from this 


// required the db in routes as nextjs run on edge
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"; 
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
      const {username,email,password} = await request.json()
      const existinguserverfiedbyusername=await UserModel.findOne({username,isverified:true})
      if (existinguserverfiedbyusername){
        return Response.json({success:false,message:"Username already exists"},
            {
                status:400
            }
        )
      }

      const existinguserbyemail=await UserModel.findOne({email})
      const verifycode=Math.floor(100000+Math.random()*900000).toString()

      if (existinguserbyemail){
       if (existinguserbyemail.isverified){
        return Response.json({success:false,message:"email already exists"},
            {
                status:400
            }
        )
       } else{
           const hashedpassword=await bcrypt.hash(password,10)
           existinguserbyemail.password=hashedpassword
           existinguserbyemail.verifycode=verifycode
           existinguserbyemail.verifycodeexpiry=new Date(Date.now()+24*60*60*1000)
           existinguserbyemail.isverified=false
           await existinguserbyemail.save()
       }
      }else{
        const hashedpassword=await bcrypt.hash(password,10)
        const expirydate=new Date()
        expirydate.setDate(expirydate.getDate()+1)

      const newuser=  new UserModel({
            username,
            email,
            password:hashedpassword,
            verifycodeexpiry:expirydate,
            verifycode,
            isverified:false,
            isacceptingmssg:true,
            messages:[]})
            await newuser.save()
      

      }

    //   send verification email
   const emailresponse= await sendVerificationEmail(email,username,verifycode)


// Function to generate a 6-digit OTP


//   const sendVerificationEmail = async (email: string,username:string,verifycode:string) => {
//   try {
//        const response= await emailjs.send(
//       "service_xyqx8lq", // Replace with your EmailJS Service ID
//       "template_z3otfok", // Replace with your EmailJS Template ID
//       {
//         username: username,
//         otp: verifycode,
//         email: email,
//       },
//       "xXgn7L2NKhZGjdk1h" // Replace with your EmailJS Public Key
//     );

//     return { success: true, message: "Verification email sent successfully" }; // Return the OTP to store for verification
//   } catch (error) {
//     console.error("Email sending failed:", error);
//     return { success: false, message: "Failed to send verification email" };
//   }
   if (!emailresponse.success){
    return Response.json({success:false,message:emailresponse.message},
        {
            status:500
        }
    )
   }
//    console.log(emailresponse)
   return Response.json({success:true,message:emailresponse.message},
    {
        status:201
    }
)
      
    } catch (error) {
        console.error("Error in creating user",error);
        return Response.json({success:false,message:"failed creating user"},
            {
                status:500
            }
        )
    }
}