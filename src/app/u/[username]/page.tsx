"use client"
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import React, {  useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, Form, FormMessage} from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { messageSchema } from "@/schemas/messageSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/ui/Navbar";
import { MessageCircleIcon } from "lucide-react";
import { Mail } from "lucide-react";
import Link from "next/link";



const page = () => {
    const {toast} = useToast()
    const params = useParams<{ username: string }>();
   
    const form=useForm<z.infer<typeof messageSchema>>({
      resolver:zodResolver(messageSchema),
          defaultValues:{
              content:""
          }
      }
  )
const onsubmit=async(data:z.infer<typeof messageSchema>)=>{
  try {
    
      const response=await axios.post<ApiResponse>(`/api/send-messages`,{
          username:params.username,
          content:data.content
      })

      toast({
          title:response.data.message,
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),
      })   

               
                

  } catch (error) {   
        const axiosError = error as AxiosError<ApiResponse>;
            toast({
              title: 'Could not send message',
              description:
                axiosError.response?.data.message ??
                'An error occurred. Please try again.',
              variant: 'destructive',
            });
  }
  finally{
    
  }
    }



    // for the suggesting message part
   
     const [issuggestionloading,setissuggestionloading]=useState(false)
     const [suggestion,setSuggestion]=useState<string[]>([])
     const [error, setError] = useState('');
    
     const {register,watch,setValue}=form
    const content=watch('content')
const fetchsuggestion= async()=>{
    setissuggestionloading(true)
    setSuggestion([])
    setError('');
    

    try {
      const response=await axios.post<ApiResponse>(`/api/suggest-messages`)
      const {messages}=response.data
      
      setSuggestion(messages as unknown as string[])
      setissuggestionloading(false)
      
    } catch (error) {
      console.error("Error in fetching suggestion",error)
      setError('Failed to fetch questions.');
      toast({
        title:"Error in fetching suggestion",
        description:"something went wrong",
        variant:"destructive"
      })
      setSuggestion([])
      setissuggestionloading(false)
    }
    finally{
      setissuggestionloading(false)
    }
  }


  
    
return (
  <> <Navbar/>
  <div className="min-h-screen flex flex-col items-center justify-center bg-white-50 gradient-radial from-white-100 via-gray-300 to-gray-600 space-y-10 px-4">
  {/* Form Section */}
  <div className="bg-blue-50 dark:bg-gray-100 shadow-2xl rounded-lg p-8 w-full max-w-lg">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-10 space-x-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                <MessageCircleIcon/>               </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  
                  className="block w-full h-25 p-4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none leading-normal"
                  placeholder="Write your message here..."
                  {...field}
                

                />
              </FormControl>
              <FormDescription className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Your feedback will be successfully sent to {params.username}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="">
        <Button
          type="submit"
          className="py-5 px-5 me-2 mb-2 text-sm font-medium text-white-900 focus:outline-none bg-black rounded-full border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100 text-white hover:bg-gray-300 hover:text-black"
        >Send
          <Mail className="mx-2 hover:text-black"/>
        </Button>
        <Button>
          <Link href="/dashboard">
              Back to Dashboard
          </Link>
        </Button>
        </div>
      </form>
    </Form>
  </div>

  {/* Space for the Second Section */}
  <div className="w-full max-w-lg bg-blue-50 dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
    <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm ">Not having Idea what to say? Click Below </p>
            
    
<div className="p-6">
<h1 className="text-2xl font-bold mb-4">Generate Open-Ended Messages</h1>

<Button
  onClick={fetchsuggestion}
  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
  disabled={issuggestionloading}
>
  {issuggestionloading ? 'Generating...' : 'Generate suggestions'}
</Button>

{error && <p className="text-red-500 mt-4">{error}</p>}

{suggestion.length > 0 && (
  <ul className="mt-6 space-y-2">
    {suggestion.map((suggestion, index) => (
      <li key={index} 
        {...register('content')}
        onClick={() => setValue('content', suggestion)}
      className="bg-gray-100 p-3 rounded-md hover:cursor-pointer hover:bg-gray-200 shadow-lg" 
      >
        {suggestion as unknown as string}
      </li>
    ))}
  </ul>
)}
</div>

  


  </div>
</div>








</>  )  
};  

export default page