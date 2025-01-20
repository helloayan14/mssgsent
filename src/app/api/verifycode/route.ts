import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request:Request) {
    await dbConnect()

    try {
        const {username,code}=await request.json()
        const decodedusername=decodeURIComponent(username)
        const user=await UserModel.findOne({username:decodedusername})
        if (!user){
            return Response.json({
                success:false,
                message:"could not find the user",

            },{status:400})

        }

        const iscodevalid=user.verifycode===code
        const isexpiryvalid=new Date(user.verifycodeexpiry) > new Date()
        if (iscodevalid && isexpiryvalid){
            user.isverified=true
            await user.save()
            return Response.json({
                success:true,
                message:"account verified successed",

            },{status:200})
        }else if (!isexpiryvalid){
            return Response.json({
                success:false,
                message:"the verification date expired please signup again ",

            },{status:400})
        }else{
            return Response.json({
                success:false,
                message:"incorrect code ",

            },{status:400})
        }
    } catch (error) {
        console.error("error verifying user",error)
        return Response.json({
            success:false,
            message:"error verifying user"
        },
        {
            status:500
        }
     )
    }
}
