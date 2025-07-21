"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import {AuthType} from './Types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FormEvent, useState } from "react";

import { TriangleAlert } from 'lucide-react';


interface LoginProps {
  setForm:(val:AuthType) => void;
}


const LoginForm = ({setForm}:LoginProps) => {

  
  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')
  const [IsLoading, setIsLoading] = useState<boolean>(false)
  const [Error, setError] = useState('')
  const [TimeOutId, setTimeOutId] = useState<NodeJS.Timeout>()

  const {signIn} = useAuthActions()

  const HandleCredentials = (e: FormEvent<HTMLFormElement>) => {
    if(IsLoading) return;
    e.preventDefault()
    clearTimeout(TimeOutId)
    setIsLoading(true)
    signIn('password',{email:Email,password:Password,flow:'signIn'})
    .catch(() => {
      setError("Invalid Email or Password")
    })
    .finally(() => {
      setIsLoading(false)
      setTimeOutId(() => {
        return setTimeout(() => setError(''),3000)
      })
    })
  }

  const HandleProvider = (Provider:'google' | 'github') => {
    signIn(Provider)
  } 

  return (
    <Card className="w-full h-full p-8 transition-[height] duration-200">
          <CardHeader className="px-0 py-0 my-0 text-2xl font-semibold">
            <CardTitle>Login to continue</CardTitle>
            <CardDescription className="px-0 pb-0 font-medium">
              Login via Email and Password or Github/Google
            </CardDescription>
          </CardHeader>
          {
            !!Error && (
              <div className="error text-danger bg-red-500/20 text-red-500 px-4 py-2 flex items-center justify-center gap-3 w-full text-center">
                <TriangleAlert />
                <p className="text-sm">{Error}</p>
              </div>
            )
          }
          <CardContent className="space-y-5 px-0">
            <form onSubmit={HandleCredentials} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter Email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={IsLoading}
                  required
                />
                <Input
                  type="password"
                  placeholder="Enter Password"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={IsLoading}
                  required
                />
              <Button disabled={IsLoading} type="submit" className="relative w-full cursor-pointer">
                Login
              </Button>
            </form>
            <Separator />
            <div className="services flex flex-col space-y-2">
              <Button
                disabled={IsLoading}
                onClick={() => HandleProvider('google')}
                variant={"outline"}
                className="relative cursor-pointer"
                >
                <FcGoogle className="absolute size-4 left-3" />
                Continue With Google
              </Button>
              <Button
                disabled={IsLoading}
                onClick={() => HandleProvider('github')}
                variant={"outline"}
                className="relative cursor-pointer"
                >
                <FaGithub className="absolute size-4 left-3" />
                Continue With Github
              </Button>
            </div>
          </CardContent>
          <CardFooter className="p-0 m-0">
            <p>Don&apos;t have an account ?&nbsp;</p> <span onClick={() => setForm('signup')} className="text-blue-300 hover:text-blue-500 cursor-pointer">Signup</span>
          </CardFooter>
        </Card>
  );
};

export default LoginForm;
