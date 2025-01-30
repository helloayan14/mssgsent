import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
 import { User } from "next-auth";
import mongoose from "mongoose";
export const dynamic = "force-dynamic";

export async function GET() {
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
     
    // as in options file  we converted the user id to string so we have to convert it back when we use it in mongodb pipline
    // it will not occur error in like findby id  or some other like that
    const userid=new mongoose.Types.ObjectId(user._id)

    try {
        const user = await UserModel.aggregate([
            {$match:{_id:userid}},
            {$unwind:"$messages"},
            {$sort:{"messages.createdAt":-1}},
            {$group:{_id:"$id",messages:{$push:"$messages"}}}
        ])
        if (!user || user.length===0){
            return Response.json({
                success:false,
                message:"User has no messages",
            },{
                status:404
            })
        }
        return Response.json({
            success:true,
            message:"success",
            messages:user[0].messages,
            data:user
        },{
            status:200
        })
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
          );
    }
} 