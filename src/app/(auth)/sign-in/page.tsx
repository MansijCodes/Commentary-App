'use client';

import React from 'react';
import { useState } from 'react';
import { AxiosError } from 'axios';
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
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { signInSchema } from '@/schemas/signInSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });
      if (response?.error) {
        const errorObj = JSON.parse(response.error);
        if (errorObj) {
          if (
            errorObj?.username &&
            errorObj?.message == 'Please verify your account before login'
          ) {
            router.push(`/verify/${errorObj?.username}`);
          }
          toast.error(errorObj?.message);
          return;
        }
        toast.error(response?.error);
      }
      if (response?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error in signing in', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data?.message;
      toast.error(errorMessage);
    } finally {
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
          Sign In
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 m-3.5'
          >
            <FormField
              control={form.control}
              name='identifier'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or email</FormLabel>
                  <FormControl>
                    <Input placeholder='username/email' {...field} />
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
                    <div className='relative'>
                      <Input
                        placeholder='password'
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword((prev) => !prev)}
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                        tabIndex={-1} //The button can’t be reached by tabbing
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={isSubmitting}
              className='bg-green-700 hover:bg-green-900'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='animate-spin h-5 w-5 mr-3' /> Please wait
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </Form>
        <div className='text-center'>
          <p>
            Don&apos;t have an account? &nbsp;
            <Link href='/sign-up' className='text-blue-600 hover:text-blue-800'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
