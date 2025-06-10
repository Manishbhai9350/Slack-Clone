'use client'
import { Button } from "@/components/ui/button";
import UserAvatar from "@/features/auth/components/UserAvatar";
import { useUser } from "@/features/auth/hooks/auth.user";
import { useAuthActions } from "@convex-dev/auth/react";
export default function Home() {
  const {signOut} = useAuthActions()

  const {user,isLoading} = useUser()

  if(isLoading) return <>
    <p>Loading...</p>
  </>

  const {name,email} = user;
  
  return (
    <main className="h-screen w-full p-8">
      <UserAvatar name={name} email={email} image={user?.image || ''} />
    </main>
  )
}
