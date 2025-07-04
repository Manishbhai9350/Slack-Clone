"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChannelAtom } from "../hooks/useChannel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { FormEvent,  useState } from "react";
import { toast } from "sonner";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { useCreateChannel } from "../api/useCreateChannel";
import { useRouter } from "next/navigation";



const CreateChannelModel = () => {
  const [open, setOpen] = useChannelAtom();
  const [Value, setValue] = useState("");

  const Router = useRouter()
  
  const workspaceId = useGetWorkspaceId();

  const { mutate, IsPending: ChannelCreationPending } = useCreateChannel();


  function HandleOnInput(e:React.ChangeEvent<HTMLInputElement>){
    const value = e.target.value.replace(/\s+/g,'-').toLowerCase()
    setValue(value)
  }


  function HandleCreateChannel(e:FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (Value.length < 3) {
      toast.error("Channel name must be atleast 3 characters long");
      return;
    }
    mutate(
      { name: Value, workspaceId },
      {
        throwError:true,
        onSuccess: (channelId) => {
          setOpen(false)
          setValue('')
          toast.success("Channel Created");
          Router.push(`/workspaces/${workspaceId}/channel/${channelId}`)
        },
        onError:(error) => {
          console.log(error)
          toast.error('Failed To Create Channel')
        }
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create A New Channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={HandleCreateChannel} className="space-y-4">
        <Input
          value={Value}
          onChange={HandleOnInput}
          type="text"
          placeholder="Create Channel e.g: Product Payment"
        />
        <div className="buttons w-full flex gap-1">
          <DialogClose asChild>
            <Button disabled={ChannelCreationPending} className="w-1/2 " variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={ChannelCreationPending} className="w-1/2 " variant="default">
            Create
          </Button>
        </div>
          </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModel;
