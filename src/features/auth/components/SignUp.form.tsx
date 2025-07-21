"use client";
import { Button } from "@/components/ui/button";
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
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { AuthType } from "./Types";
import { FormEvent, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface SignUpProps {
  setForm: (val: AuthType) => void;
}

const SignUpForm = ({ setForm }: SignUpProps) => {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [Error, setError] = useState("");
  const [TimeOutId, setTimeOutId] = useState<NodeJS.Timeout>();

  const { signIn } = useAuthActions();

  const HandleCredentials = (e: FormEvent<HTMLFormElement>) => {
    if (IsLoading) return;
    e.preventDefault();
    clearTimeout(TimeOutId);
    if(Password !== ConfirmPassword) {
      setError("Password Didn't Match")
      setTimeOutId(() => {
        return setTimeout(() => setError(''),3000)
      })
      return 
    }
    setIsLoading(true);
    signIn("password", { email: Email, password: Password, name:Name, flow: "signUp" })
      .catch(() => {
        setError("Invalid Email or Password");
      })
      .finally(() => {
        setIsLoading(false);
        setTimeOutId(() => {
          return setTimeout(() => setError(""), 3000);
        });
      });
  };

  const HandleProvider = (Provider: "google" | "github") => {
    signIn(Provider);
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pb-0 text-2xl font-semibold">
        <CardTitle>Signup to continue</CardTitle>
        <CardDescription className="px-0 pb-0 font-medium">
          Signup via Email and Password or Github/Google
        </CardDescription>
      </CardHeader>
      {!!Error && (
        <div className="error text-danger bg-red-500/20 text-red-500 px-4 py-2 flex items-center justify-center gap-3 w-full text-center">
          <TriangleAlert />
          <p className="text-sm">{Error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0">
        <form onSubmit={HandleCredentials} className="space-y-2">
          <Input
            type="text"
            placeholder="Enter Fullname"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            disabled={IsLoading}
            required
          />
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
          <Input
            type="password"
            placeholder="Confirm Password"
            value={ConfirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={IsLoading}
            required
          />
          <Button
            disabled={IsLoading}
            type="submit"
            className="relative w-full cursor-pointer"
          >
            Signup
          </Button>
        </form>
        <Separator />
        <div className="services flex flex-col space-y-2">
          <Button
            onClick={() => HandleProvider("google")}
            disabled={IsLoading}
            variant={"outline"}
            className="relative cursor-pointer"
          >
            <FcGoogle className="absolute size-4 left-3" />
            Continue With Google
          </Button>
          <Button
            onClick={() => HandleProvider("github")}
            disabled={IsLoading}
            variant={"outline"}
            className="relative cursor-pointer"
          >
            <FaGithub className="absolute size-4 left-3" />
            Continue With Github
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-0 m-0">
        <p>Already have an account?&nbsp;</p>{" "}
        <span
          onClick={() => setForm("signin")}
          className="text-blue-300 hover:text-blue-500 cursor-pointer"
        >
          Login
        </span>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;
