import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
 import { User } from "next-auth";
import mongoose, { mongo } from "mongoose";

export async function DELETE(req: Request,{params}:{params:{messageid:string}}) {
   const messageId= params.messageid
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
     
    try {
       const updatedresult= await UserModel.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id:messageId}}}
        )

        if (updatedresult.modifiedCount===0){
            return Response.json({
                success:false,
                message:"message not found or deleted already",
            },{
                status:404
            })
        }else{
            return Response.json({
                success:true,
                message:"message deleted successfully",
            },{
                status:200,
             
            })
        }
        
    } catch (error){
                 console.error("error deleting message",error)
                 return Response.json({
                     success:false,
                     message:"something went wrong",
                 },{
                     status:500,
                 }
                 )
    }
    


        
    }