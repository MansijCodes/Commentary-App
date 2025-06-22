'use client';

import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message, User } from '@/model/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

  const { data: session } = useSession();
  const user = session?.user as User;

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const handleMessageDelete = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue('acceptMessages', response.data.isAcceptingMessage || false);
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message);
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>(`/api/get-messages`);
        setMessages(response?.data.messages || []);
        if (refresh) {
          toast.info('showing latest messages');
        }
      } catch (error) {
        console.error(error);
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data?.message);
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session && !user) return;
    fetchAcceptMessage();
    fetchMessages(true);
  }, [session, user, fetchAcceptMessage, fetchMessages, setValue]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post('/api/accept-messages', {
        acceptMessage: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast.success(response?.data?.message);
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message);
    }
  };

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : '';
  const profileUrl = `${baseUrl}/u/${user?.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.info('copied url');
  };

  if (!session && !user) {
    return <div>Please login first</div>;
  }

  return (
    <div className='mt-[140px] my-8 mx-4 p-8  bg-white font-bold'>
      <h1 className='text-5xl mb-8 text-amber-400 text-center'>
        User Dashboard
      </h1>

      <div className='mb-4'>
        <h2>Copy your unique link:</h2>
        <div className='flex gap-2'>
          <input
            className='border-2 w-full'
            type='text'
            value={profileUrl}
            disabled
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className='mb-4'>
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className='ml-4'>
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className='mt-4'
        variant='outline'
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? <Loader2 className='animate-spin ' /> : <RefreshCcw />}
      </Button>

      <h2 className='mt-4 text-xl text-emerald-700'>Messages Received:</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-4 gap-4'>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleMessageDelete}
            />
          ))
        ) : (
          <p>No messages to show</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
