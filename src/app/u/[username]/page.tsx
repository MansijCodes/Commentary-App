'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

function UserPage() {
  const params= useParams();
  const username= params.username;
  const[isLoading,setIsLoading]= useState(false);
  const [suggestedMessages,setSuggestedMessages]=useState('')
  const [suggestionList,setSuggestionList]= useState<string[]>([]);

  const form= useForm<z.infer<typeof messageSchema>>({
    resolver:zodResolver(messageSchema),
    defaultValues:{
      content:''
    }
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>)=>{
    try {
      const response = await axios.post<ApiResponse>(`/api/send-message`,{...data,username});
      if(response?.data?.success){
        toast.success(response?.data?.message)
        form.setValue('content','')
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data?.message)
    }
  }

  const getMessageSuggestion = async ()=>{
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/suggest-messages`);
      if(response?.data?.success){
        toast.success('Message generated succesfully')
        setSuggestedMessages(response?.data?.message)
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }

  const handleSuggestionClick =(suggestion:string)=>{
    form.setValue('content',suggestion);
  }

  useEffect(()=>{
    if(suggestedMessages){
      setSuggestionList(suggestedMessages.split('||'))
    }
  },[suggestedMessages])

  return (
    <div className='mx-auto m-9 max-w-7xl flex flex-col justify-center items-center'>
      <h1 className='text-center text-6xl mb-9 text-amber-700 font-extrabold'><span className='text-amber-400'>Confess / Ask / Comment</span> the Unheard</h1>
      <div className='w-full mb-24 p-9'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6 items-center justify-center'>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className='w-full max-w-[768px]'>
                  <FormLabel className='mb-2'>{`Send anonymous message to ${username}`}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write message here" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button type="submit" className='max-w-fit bg-green-600'>Send Message</Button>
          </form>
        </Form>
      </div>

      <div className='p-9 w-full'>
          <h2 className='text-2xl text-cyan-500 mb-6'>Ask <span className='text-cyan-900'>AI</span> to generate innovative random messages</h2>
          <Button onClick={getMessageSuggestion} className='mb-4'>{isLoading?
            <>
              <Loader2 className='animate-spin'/>&nbsp;Please wait
            </>:'Ask AI'}
          </Button>
          {suggestedMessages != '' ? 
            (
              <Card className=''>
            <CardHeader>
              <CardTitle>Generated Message:</CardTitle>
            </CardHeader>
            <CardContent>
              {
                suggestionList?(suggestionList.map((suggestion,index)=>
                  <Button key={index} onClick={()=>handleSuggestionClick(suggestion)} className='whitespace-pre-wrap h-auto  min-h-[40px] bg-gray-200 hover:bg-gray-100 text-black mb-4'>{suggestion}</Button>
                )):("")
              }
            </CardContent>
            
          </Card>
            )
          :""}
      </div>
    </div>
  )
}

export default UserPage