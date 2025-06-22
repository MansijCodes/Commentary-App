'use client';

import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ApiResponse } from '@/types/ApiResponse';
import { signUpSchema } from '@/schemas/signUpSchema';
import { Loader, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function SignUp() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data?.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError?.response?.data?.message || 'Error in checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsername();
  }, [username]);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const baseUrl =
        typeof window !== 'undefined'
          ? `${window.location.protocol}//${window.location.host}`
          : '';

      const response = await axios.post<ApiResponse>('/api/sign-up', {
        ...data,
        baseUrl,
      });
      toast.success(response.data?.message);
      router.push(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error in signing up', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data?.message;
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex min-h-screen justify-center items-center '>
      <div className='w-full max-w-md flex flex-col p-8 bg-gray-50 rounded-b-md'>
        <Link href={'/'} className='self-center mb-2'>
          <Image
            src='/commentary.png'
            alt='commentary image'
            width={180}
            height={38}
          />
        </Link>
        <h1 className='font-bold text-center mb-7.5 text-2xl text-gray-500'>
          Create an account
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 m-3.5'
          >
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='username'
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>

                  {isCheckingUsername ? (
                    <Loader2 className='animate-spin' />
                  ) : (
                    ''
                  )}
                  {username ? (
                    <p
                      className={`text-sm ${usernameMessage == 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {usernameMessage}
                    </p>
                  ) : (
                    ''
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={isSubmitting}
              className='bg-blue-800 hover:bg-blue-900'
            >
              {isSubmitting ? (
                <>
                  <Loader className='animate-spin h-5 w-5 mr-3' /> Please wait
                </>
              ) : (
                'Create'
              )}
            </Button>
          </form>
        </Form>
        <div className='text-center'>
          <p>
            Already have an account? &nbsp;
            <Link href='/sign-in' className='text-blue-600 hover:text-blue-800'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
