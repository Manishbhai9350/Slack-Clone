"use client";
import { useEffect, useMemo } from "react";
import UserAvatar from "@/features/auth/components/UserAvatar";
import { useWorkspaces } from "@/features/workspace/api/useWorkspaces";
import { useWorkspaceAtom } from "@/features/workspace/hooks/useWorkSpace";


export default function Home() {
  const { Data, IsLoading } = useWorkspaces();
  const [open, setOpen] = useWorkspaceAtom();


  const WorkSpaceId = useMemo(() => Data?.[0]?._id,[Data])

  useEffect(() => {
    if(!WorkSpaceId) {
      setOpen(true)
    }
  }, [WorkSpaceId])
  

  return (
    <main className="h-screen w-full p-8">
      <UserAvatar />
    </main>
  );
}
