/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useMemo } from "react";
import UserAvatar from "@/features/auth/components/UserAvatar";
import { useWorkspaces } from "@/features/workspace/api/useWorkspaces";
import { useWorkspaceAtom } from "@/features/workspace/hooks/useWorkSpace";
import { useRouter } from "next/navigation";


export default function Home() {
  const { Data} = useWorkspaces();
  const [, setOpen] = useWorkspaceAtom();

  const router = useRouter()


  const WorkSpaceId = useMemo(() => Data?.[0]?._id,[Data])


  useEffect(() => {
    if(!WorkSpaceId) {
      setOpen(true)
    } else {
      setOpen(false)
      router.replace(`/workspaces/${WorkSpaceId}`)
    }
  }, [WorkSpaceId,router,setOpen])
  

  return (
    <main className="h-screen w-full p-8">
      <UserAvatar />
    </main>
  );
}
