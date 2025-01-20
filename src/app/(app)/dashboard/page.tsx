// (app)  it get ignored by router due to paranthesis
"use client"

import { Button } from "@/components/ui/Button";
import MessageCard from "@/components/ui/MessageCard";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessage";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
    const [messages,setMessages]=useState<Message[]>([])
    const [isloading,setIsloading]=useState(false)
     
    // for button state
    const [isswitchingloading,setisSwitchingloading]=useState(false)
    

    const {toast}=useToast()


    const handleDeleteMessage=async(messageId:string)=>{
        setMessages(messages.filter((message)=>message._id!==messageId))
    }
    
    const {data:session}=useSession()
    const form=useForm({
        resolver:zodResolver(
            acceptMessageSchema
        )

    })

    const {register,watch,setValue}=form
    const choice=watch('acceptingmssg')

    const fetchacceptmessage=useCallback(async()=>{
        setisSwitchingloading(true)
        try {
            const response=await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptingmssg',response.data.isacceptingmssg)
        } catch (error) {
            const axioserror=error as AxiosError<ApiResponse>
            toast({
                title:"error",
                description:axioserror.response?.data.message || "something went wrong",
                variant:"destructive"
            })
        }
        finally{    
            setisSwitchingloading(false)
        }
    },[setValue])

    const fetchmesssages=useCallback(async(refresh:boolean = false   )=>{
        setIsloading(true)
        setisSwitchingloading(false)
        try {
            const response=await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages ||   [])
            if(refresh){
                toast({
                    title:"refreshed messages",
                    description:"showing latest all messages"
                })
            }
        } catch (error) {
            const axioserror=error as AxiosError<ApiResponse>
            toast({
                title:"error",
                description:axioserror.response?.data.message || "something went wrong",
                variant:"destructive"
            })
        }finally{
            setIsloading(false)
            setisSwitchingloading(false)
        }
    },[setIsloading,setMessages])

    useEffect(()=>{
        fetchacceptmessage()
        fetchmesssages()
        if (!session || !session.user) return

    },[fetchmesssages,fetchacceptmessage,setValue,session])
     
    const handleswitchchange=async()=>{
       try {
         const response= await axios.post<ApiResponse>('/api/accept-messages',{
             choice:!choice
         })
         setValue('acceptingmssg',!choice)

         toast({
             title:response.data.message,
              variant:"default",
         })
       } catch (error) {
        const axioserror=error as AxiosError<ApiResponse>
            toast({
                title:"error",
                description:axioserror.response?.data.message || "something went wrong",
                variant:"destructive"
            })
       }
    }

    // for the url link
     const {username}=session?.user as User
    //  for url we have to first derive the base url is we are using local host or other
      const baseurl=`${window.location.protocol}//${
        window.location.host
      }`

      const profileurl=`${baseurl}/u/${username}`

     const copyToClipboard = () => {
         navigator.clipboard.writeText(profileurl);
         toast({
             title:"copied to clipboard",
             description:"profile url copied to clipboard"
         })
     }
    if (!session || !session.user) {
        return <div>Please Login</div>
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
    
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
            <div className="flex items-center">
              <input
                type="text"
                value={profileurl}
                disabled
                className="input input-bordered w-full p-2 mr-2"
              />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </div>
    
          <div className="mb-4">
            <Switch
              {...register('acceptingmssg')}
              checked={choice}
              onCheckedChange={handleswitchchange}
              disabled={isswitchingloading}
            />
            <span className="ml-2">
              Accept Messages: {choice ? 'On' : 'Off'}
            </span>
          </div>
          <Separator />
    
          <Button
            className="mt-4"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchmesssages(true);
            }}
          >
            {isloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <p>No messages to display.</p>
            )}
          </div>
        </div>
      );
}