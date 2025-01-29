"use client"

import {
    Card,
    CardContent,
    CardDescription,
   
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

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
  } from "@/components/ui/alert-dialog"
  import { Button } from "./Button"
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";



type MessageCardProps = {
  message:Message;
  onMessageDelete:(messageId:string)=>void
  sender?:string
  // here the void does not means null it means it could be anything we dont know 
}
const MessageCard = ({message,onMessageDelete,sender}:MessageCardProps) => {
  const {toast} = useToast()
 
  const handledeleteconfirm=async()=>{
try {
  const response=await  axios.delete<ApiResponse>(`/api/deletemessages/${message._id as string}`)
  console.log(response)
     toast({
      title:response.data.message,
      variant:"default"
       })
      
  
     onMessageDelete(message._id as string)
} catch (error) {
  const axioserror=error as AxiosError<ApiResponse>
  toast({
    title:"Error in deleting message",
    description:axioserror.response?.data.message || "something went wrong",
    variant:"destructive"
  })
  
}
  }
    return (
        <Card>
  <CardHeader> 
    <CardTitle className="mx-auto"> Message from {sender}</CardTitle>
    <CardContent> {message.content}</CardContent>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full md:w-auto">Delete<X className="w-4 h-4"/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handledeleteconfirm} className="bg-red-600 focus:ring-red-600">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription>Recieved at {new Date(message.createdAt).toLocaleString()}</CardDescription>
  </CardHeader>


</Card>

    )
};

export default MessageCard;