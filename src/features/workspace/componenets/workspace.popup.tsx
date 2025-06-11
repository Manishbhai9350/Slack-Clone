"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { useWorkspaceAtom } from "../hooks/useWorkSpace";
import { useCreateWorkSpace } from "../api/creatWorkspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner"


const WorkSpacePopup = () => {
  const [open, setOpen] = useWorkspaceAtom();
  const [IsMounted, setIsMounted] = useState(false);
  const [Name, setName] = useState("");

  const { mutate, Data, state, IsPending, IsSuccess, IsError, IsSetteled } =
    useCreateWorkSpace();

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const HandleCreation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Name.length == 0) return;
    const Data = mutate(
      { name: Name },
      {
        onSuccess: (workspaceId) => {
          toast.success('Workspace Created')
          setOpen(false)
          router.push(`/workspaces/${workspaceId}`);
        },
      }
    );
  };

  if (!IsMounted) return null;

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={HandleCreation} className="space-y-4 w-full">
          <Input
            disabled={IsPending}
            value={Name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Create Workspace ex: 'Project', 'Home', 'Venues'"
          />
          <Button disabled={IsPending} className="w-full" type="submit">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkSpacePopup;
