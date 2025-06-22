import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import UserModel from '@/model/User';
import { NextRequest } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';

export async function DELETE(request: NextRequest) {
  await dbConnect();
  const messageId = request.nextUrl.searchParams.get('messageId');

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: 'Not Authenticated',
      },
      {
        status: 401,
      }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if (updatedResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: 'Message not found or already deleted',
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: 'Message deleted successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: 'Error while deleting message',
      },
      {
        status: 500,
      }
    );
  }
}
