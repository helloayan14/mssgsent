import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

import { Message } from "@/model/User";

async function POST(req: Request) {
    await dbConnect()
    const {username,content}=await req.json()

    try {
          const user=await UserModel.findOne({username})
          if (!user){
            return Response.json({
                success:false,
                message:"user not found",
            },{
                status:404
            })
          }

        //   is user is accepting messages or not
        if (!user.isacceptingmssg){
            return Response.json({
                success:false,
                message:"user is not accepting messages",
            },{
                status:400
            })
        }

        const newmessage={
            content,
            createdAt:new Date()
        }

        user.messages.push(newmessage as Message)
        await user.save()
        return Response.json({
            success:true,
            message:"message sent successfully",
        },{
            status:200
        })

    } catch (error) {
        console.log("unexpected error",error)
        return Response.json({
            success:false,
            message:"something went wrong",
        },{
            status:500
        })
    }
}