'use client'
import { Button } from "@/components/ui/button";
import AuthScreen from "@/features/auth/components/Auth.screen";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {
  const {signOut} = useAuthActions()
  return (
    <main className="">
      <h1>Home Page</h1>
      <Button onClick={signOut}>
        Logout
      </Button>
    </main>
  )
}
