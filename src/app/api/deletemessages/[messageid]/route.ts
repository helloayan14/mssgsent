import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel, { Message } from "@/model/User";
import dbConnect from "@/lib/dbConnect";
 import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface message extends Message{
    params:{messageid:string}
}
    export async function DELETE(request:NextRequest,{params}:message) {
      const {messageid}=params
    const headers=request.headers
   
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
        
        try {
        const updatedresult= await UserModel.updateOne(
                {_id:user._id},
            {$pull:{messages:{_id:messageid}}}
        )
        
        if (updatedresult.modifiedCount===0){
            return NextResponse.json({
                success:false,
                message:"Message not found or deleted already",
            },{
                status:404,
                headers
            })
        }else{
            return NextResponse.json({
                success:true,
                message:"Message deleted successfully",
            },{
                status:200,
             
            })
        }
        
    } catch (error){
                 console.error("Error deleting message",error)
                 return NextResponse.json({
                     success:false,
                     message:"Something went wrong",
                 },{
                     status:500,
                 }
                 )
    }
    


        
    }