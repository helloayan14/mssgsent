//(auth) means collection or group

'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/Button"

import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

import Link from "next/link"

const page=() => {
  
  const { toast } = useToast()

  const router=useRouter() 

  // zod implementation
  // it will give info like the schema given
const form=useForm<z.infer<typeof signInSchema>>({
  resolver:zodResolver(
    signInSchema
  ),
  defaultValues:{
    email:'',
    password:'',
  }
})
     
  
  const onsubmit=async(data:z.infer<typeof signInSchema>)=>{
//  here we use next auth  signup was manual process
try{
  const result= await signIn("credentials",{
    email:data.email,
    password:data.password,
    redirect:false
  })
  
  if (result?.error){
      if (result.error === 'CredentialsSignin') {                                      
      toast({
    title:"Credentials error",
    description:"something went wrong in sign in"
  })} else {
    toast({
      title:"Not a Credential error",
      description:"Something other prolbem"
    })
  }}

   
     
  if (result?.url){
  
  toast({
    title:"Authorized ",
    description:"Signed in successfully"
  })
  router.replace('/dashboard')
  }}
catch (error) {
console.log("Error in sign in",error)
  toast({
    title:"Error of system",
    description:"something went wrong in sign in"
  })

}}
  return(
<div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

    <div className="text-center">
      <h1 className="text-4xl font-extrabold 
      tracking-tight lg:text-5xl mb-6">
        Join Mssg sent

      </h1>
      <p className="mb-4">Sign in to your account</p>

    </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6"> 



<FormField
        name="email"
control={form.control}

render={({ field }) => (
<FormItem>
  <FormLabel>Email</FormLabel>
  <FormControl>
    <Input  {...field}
    />
  </FormControl>
  <FormDescription></FormDescription>
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
  <FormDescription></FormDescription>
  <FormMessage />
</FormItem>
)}
/>  
  <Button type="submit" >
    Sign In
  </Button>

      </form>
    </Form>
    <div className="text-center mt-4">
      <p>
        Not a member yet?{' '}
        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
          Sign up
        </Link>
      </p>
    </div>
  
    </div> </div>
  )
}


export default page
