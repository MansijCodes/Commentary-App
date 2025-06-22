import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!user || !session.user){
        return Response.json({
            success:false,
            message:'Not Authentication'
        },{
            status:401
        })
    }
    const userId = user._id;
    const {acceptMessage }= await request.json();

    try {
        if(userId){
            const updatedUser= await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessage},{new:true});
            if(!updatedUser){
                return Response.json({
                    success:false,
                    message:'Failed in updating user'
                },{
                    status:401
                })
            }
            return Response.json({
                success:true,
                message:'Message acceptance status updated successfully',
                updatedUser
            },{status:200})
        }
    } catch (error) {
        console.error('Failed to update user status to accept message',error)
        return Response.json({
            success:false,
            message:'Failed to update user status to accept message'
        },{
            status:500
        })
    }
}

export async function GET(){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !user){
        return Response.json({
            success:false,
            message:'Not Authentication'
        },{
            status:401
        })
    }
    const userId = user._id;

    try {
        const user = await UserModel.findById(userId);
        if(!user){
            return Response.json({
                success:false,
                message:'User not found'
            },{
                status:404
            })
        }
        return Response.json({
            success:true,
            isAcceptingMessage: user.isAcceptingMessage
        },{
            status:200
        })
    } catch (error) {
        console.error('Failed to get status of accept message',error)
        return Response.json({
            success:false,
            message:'Failed to get status of accept message'
        },{
            status:500
        })
    }
}