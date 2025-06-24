import UseConfirm from "@/components/hooks/useConfirm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UseNewJoincode } from "@/features/workspace/api/useNewJoinCode";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { cn } from "@/lib/utils";
import { Check, LinkIcon, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  name: string;
  joinCode: string;
}

const InviteModal = ({ open, setOpen, joinCode, name }: InviteModalProps) => {

    const workspaceId = useGetWorkspaceId()
    const [confirm,ConfirmModal] = UseConfirm()

    const [IsCopied, setIsCopied] = useState(false)
    const [IsGenerated, setIsGenerated] = useState(false)

    const {mutate:RegenerateJoinCode,IsPending} = UseNewJoincode()

    const HandleGenerateCode = async () => {
        if(IsGenerated) return;
        const ok = await confirm()

        if(!ok) return;

        RegenerateJoinCode({workspaceId},{
            onSuccess(){
                toast.success("Invite Code Regenerated")
                setIsGenerated(true)
                setTimeout(() => {
                  setIsGenerated(false)
                },2000)
            },
            onError(){
                toast.success("Failed To Regenerate Invite Code")
            }
        })
    }

    const HandleCopyLink = () => {
      if(IsCopied) return;
      navigator.clipboard.writeText(`${window.location.origin}/join/${workspaceId}`).then(() => {
        toast.success("Invite Link Copied")
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        },2000)
      })
    }

  return (
    <>
    <ConfirmModal title="Regenerate A New Invite Code" message="Are You Sure?" />
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle >Invite People To {name}</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="flex flex-col my-3 justify-center items-center space-y-3">
            <h1  className="text-5xl font-bold tracking-widest my-4 uppercase">
              {joinCode}
            </h1>
            <Button onClick={HandleCopyLink} variant="outline" className={
              cn('transition-all duration-300',IsCopied ? 'bg-green-500 text-white hover:bg-green-500 hover:text-white' : '')}>
              Copy Invite Link
              {
                IsCopied ? <Check className="size-4" /> : <LinkIcon className="size-4" /> 
              }
            </Button>
          </div>
        </DialogDescription>
        <DialogFooter className="w-full">
          <div className="flex justify-between items-center w-full">
            <Button disabled={IsPending} onClick={HandleGenerateCode} variant="outline" className={
              cn('transition-all duration-300',IsGenerated ? 'bg-green-500 text-white hover:bg-green-500 hover:text-white' : '')}>
              New Code {
                IsGenerated ? <Check className="size-4" /> : <RefreshCw className="size-4" /> 
              }
            </Button>
            <DialogClose asChild>
              <Button disabled={IsPending} >Close</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default InviteModal;
