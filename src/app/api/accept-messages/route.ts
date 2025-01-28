import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
 import { User } from "next-auth";



// for toggling the user choice to accept the message status or not
export async function POST(req: Request) {
    await dbConnect()

   const session=await getServerSession(authOptions)
   const user:User=session?.user
   if (!session || !user){
        return Response.json({
            success:false,
            message:"Not authenticated",
        },{
            status:401
        })   
   }

   const userid=user._id
   const {choice}=await req.json()
   try {
    const updateduser=await UserModel.findByIdAndUpdate(userid,{isacceptingmssg:choice},{new:true})
    if (!updateduser){
        return Response.json({
            success:false,
            message:"User not found",
        },{
            status:404
        })
    } 

   

    return Response.json({
        success:true,
        message:"successfully choosed  accepting messages",
        updateduser
    },{
        status:200
    })

   } catch (error) {
    console.error("error in choosing accepting messages",error);
    return Response.json({
        success:false,
        message:"error accepting messages",
    },{
        status:500
    }) 
   }

}
// checking the status of user
export async function GET(req: Request) {
    await dbConnect()

    const session=await getServerSession(authOptions)
    const user:User=session?.user
    if (!session || !user){
         return Response.json({
             success:false,
             message:"not authenticated",
         },{
             status:401
         })   
    }
 
    const userid=user._id

try {
        const founduser=await UserModel.findById(userid)
        if (!founduser){ 
            return Response.json({
                success:false,
                message:"user not found",
            },{
                status:404})
        }
    
        return Response.json({
            success:true,
            message:"success",
            isacceptingmssg:founduser.isacceptingmssg
        },{
            status:200
        })
} catch (error) {
    console.error("error accepting messages",error);
    return Response.json({
        success:false,
        message:"error accepting messages",
    },{
        status:500
    })
}



}