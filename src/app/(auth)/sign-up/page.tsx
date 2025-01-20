//(auth) means collection or group

'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import  {useDebounceCallback} from "usehooks-ts"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/Button"
import { Loader2 } from "lucide-react"

const page=() => {
  const [username,setUsername]=useState('')
  // for the suggestion message the username is unique or not on backend side
  const [usernamemssg,setUsernamemssg]=useState('')
  // loading state while checking the username 
  const [ischeckingusername,setIscheckingusername]=useState(false)
  const [issubmitting,setIssubmitting]=useState(false)

  // it is the username taken from frontend end to backend for hte validation check in backend
  // so we give milliseconds param which is time taken to check or call backend api after clicking a key 

  const debounced=useDebounceCallback(setUsername,300)


  const { toast } = useToast()

  const router=useRouter() 

  // zod implementation
  // it will give info like the schema given
  const form=useForm<z.infer<typeof signupSchema>>({
    resolver:zodResolver(
      signupSchema
    ),
    defaultValues:{
      username:'',
      email:'',
      password:'',
    }
  })

  useEffect(() => {
     const checkusername=async () => {
        // here we write useraname because of the value here comes after the debouncing
        if (username){
          setIscheckingusername(true)
          setUsernamemssg('')
          try {
           const response= await axios.get(`/api/check-username-unique?username=${username}`)
           setUsernamemssg(response.data.message)
          } catch (error) {
            const axioserror=error as AxiosError<ApiResponse>
            setUsernamemssg(
              axioserror.response?.data.message ?? "something went wrong"
            )
          }
          finally{
            setIscheckingusername(false)
          }
     }  
  };  checkusername()
},  [username])
     
   const onsubmit=async(data:z.infer<typeof signupSchema>)=>{
    setIssubmitting(true)
    console.log(data)
    try {
      const response=await axios.post<ApiResponse>("/api/sign-up",data)
      setUsernamemssg(response.data.message);
      toast({
        title:"success",
        description:response.data.message,

      })

      router.replace(`/verify/${username}`)
      setIssubmitting(false)
    } catch (error) {
      console.error("error in signup error",error)  
      const axioserror=error as AxiosError<ApiResponse>
      let errormessage=axioserror.response?.data.message ?? "something went wrong"
      toast({
        title:"signup error",
        description:errormessage,
        variant:"destructive"
      })
      setIssubmitting(false)
    }
   }
  return(
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

        <div className="text-center">
          <h1 className="text-4xl font-extrabold 
          tracking-tight lg:text-5xl mb-6">
            Join Mystery Message

          </h1>
          <p className="mb-4">Sign up to start your anonymous conversation</p>

        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6"> 
          <FormField
           name="username"
  control={form.control}
 
  render={({ field }) => (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input placeholder="username" {...field}
        onChange={
          (e)=>{
            field.onChange(e)
            debounced(e.target.value)
          }
        }
        />

      </FormControl>
      {ischeckingusername && <Loader2 className="animate-spin"/>}

       <p className={`text-sm ${usernamemssg==="username is unique" ? 'text-green-500' : 'text-red-500'}`}>
         {usernamemssg}
       </p>
      <FormDescription>This is your public display name.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>


<FormField
           name="email"
  control={form.control}
 
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="email" {...field}
        />
      </FormControl>
      <FormDescription>This is your email of this account.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
           name="password"
  control={form.control}
 
  render={({ field }) => (
    <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl>
        <Input type="password" placeholder="password" {...field}
        />

      </FormControl>
      <FormDescription>This is your password of this account.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>  
      <Button type="submit" disabled={issubmitting}>
{
  issubmitting ? (
  <>
  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>please wait 
  
  </>
  ) :('sign up')
}
      </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}

            <Link href="/sign-in" className="text-blue-500 hover:text-blue-700">
             sign in </Link>
          </p>
        </div>
        </div> </div>
  )
}

export default page
