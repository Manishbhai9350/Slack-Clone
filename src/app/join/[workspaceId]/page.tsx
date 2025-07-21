"use client";
import Image from "next/image";
import { JoinWorkspaceInput } from "../_components/Join-Input";
import { useEffect, useMemo, useState } from "react";
import { useGetWorkspaceInfo } from "@/features/workspace/api/useGetWorkspaceInfo";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { Loader, MoveLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useJoinWorkspace } from "@/features/workspace/api/useJoinWorkspace";
import { useRouter } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

const JoinPage = () => {
  const workspaceId = useGetWorkspaceId();
  const { Data, IsLoading } = useGetWorkspaceInfo({ workspaceId });

  const [JoinCode, setJoinCode] = useState("");

  const Router = useRouter()

  const {mutate:Join,IsPending} = useJoinWorkspace()

  const IsMember = useMemo(() => Data!.isMember,[Data])

  useEffect(() => {
    if(IsMember){
      Router.replace(`/workspaces/${workspaceId}`)
    }
    
    return () => {
      
    }
  }, [IsMember,Router,workspaceId])
  

  function HandleOnChange(value: string) {
    const NewVal = value.toUpperCase();
    setJoinCode(NewVal);
  }

  function HandleComplete(value: string) {
    Join({joinCode:value,workspaceId},{
      onSuccess(workspaceId:Id<'workspaces'>){
        toast.success('Successfully Joined To '+Data?.name)
        Router.replace(`/workspaces/${workspaceId}`)
      },
      onError(){
        toast.error('Failed To Join '+Data?.name)
      },
      throwError:true
    })
  }

  if (IsLoading) {
    return (
      <div className="w-full h-full text-black flex flex-col justify-center items-center">
        <Loader className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full h-full text-black flex flex-col justify-center items-center">
      <Image src="/icon.svg" width={200} height={300} alt="Logo" />
      <div className="flex flex-col justify-center items-center space-y-4">
        <h1 className="text-4xl font-semibold">Join {Data?.name}</h1>
        <p className="text-2xl opacity-70">Enter Invite Code To Join</p>
        <JoinWorkspaceInput
          disabled={IsPending}
          value={JoinCode}
          onChange={HandleOnChange}
          onComplete={HandleComplete}
        />
        <Button variant={"outline"} asChild>
          <Link href="/" className="p-4 text-2xl"> <MoveLeft /> Back To Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
