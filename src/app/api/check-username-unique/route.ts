import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {usernamevalidate }from "@/schemas/signUpSchema";



const Usernamequeryschema = z.object({
    username:usernamevalidate
})

export async function GET(request:Request) {
    await dbConnect()

    try {
        //  we get the username to check in the url from query params
        const {searchParams} = new URL(request.url)
        const queryparam={
            username:searchParams.get('username')
        }

        //valdiate with zod
        const result= Usernamequeryschema.safeParse(queryparam)
        console.log(result)
        if (!result.success){
            const usernameerors=result.error.format().username?._errors || []
             return Response.json({
                success:false,
                message:usernameerors?.length>0 ? usernameerors.join(', ') :'invalid query params',
             },{
                status:400
             }
            )
        }
           const {username}=result.data
           const existinguserverified=await UserModel.findOne({username,isverified:true})
           if (existinguserverified){
            return Response.json({
                success:false,
                message:"username is already taken",
    
            },{
                status:400
            })
           }

        return Response.json({
            success:true,
            message:"username is unique",

        },{
            status:201
        }
    )

    } catch (error) {
        console.error("error checking the username",error)
        return Response.json({
            success:false,
            message:"could not check the username",

        },
        {
            status:500
        }
    )
    }
}