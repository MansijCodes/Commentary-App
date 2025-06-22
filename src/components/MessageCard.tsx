import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message?messageId=${message._id}`
    );
    toast.success(response?.data.message);
    if (response?.data?.success) {
      onMessageDelete(message._id as string);
    }
  };

  return (
    <Card className='px-6 py-9 bg-gray-100'>
      <CardHeader>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='destructive'
              className=' absolute max-w-[30px] justify-self-end'
            >
              <X className='w-5 h-5' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete the message?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                message and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CardTitle className='mt-4 text-blue-900'>
          ID: {message._id as string}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-cyan-800 text-4xl'>{message.content}</p>
      </CardContent>
    </Card>
  );
}

export default MessageCard;
