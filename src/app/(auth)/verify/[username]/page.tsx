'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from "zod"

function VerifyUser() {
  const [isSubmitting,setIsSubmitting]= useState(false);
  const params= useParams();
  const router=useRouter();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues:{
        code:''
    }
  })

  const onSubmit = async (data:z.infer<typeof verifySchema>)=>{
    const username= params?.username;
    const code= data?.code;
    setIsSubmitting(true);

    try {
        const response= await axios.post(`/api/verify-code`,{username,code});
        toast.success(response?.data?.message);
        router.push('/sign-in');
    } catch (error) {
        console.error('Error in verifying code up',error);
        const axiosError= error as AxiosError<ApiResponse>;
        const errorMessage= axiosError.response?.data?.message;
        toast.error(errorMessage);
    }finally{
        setIsSubmitting(false)
    }
  }
  return (
    <div className='flex min-h-screen justify-center items-center '>
        <div className='w-full max-w-md flex flex-col p-8 bg-gray-50 rounded-b-md'>
            <h1 className='font-extrabold text-center mb-1.5'>Verify your account</h1>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Verify code</FormLabel>
                        <FormControl>
                            <Input placeholder="code" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {
                            isSubmitting? (
                                <>
                                    <Loader className='animate-spin h-5 w-5 mr-3'/> Please wait
                                </>
                            ):('Verify')
                        }
                    </Button>
                </form>
            </Form> 
            <p className='text-gray-400 text-[12px] mt-4'>[Verification code is sent to the email you provided while sign up]</p>
        </div>
    </div>
  )
}

export default VerifyUser