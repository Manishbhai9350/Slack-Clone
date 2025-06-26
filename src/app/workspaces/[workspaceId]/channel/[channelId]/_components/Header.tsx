import UseConfirm from "@/components/hooks/useConfirm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRemoveChannel } from "@/features/channels/api/removeChannel";
import { useGetChannelId } from "@/features/channels/hooks/useChannelId";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import EditChannelName from "./EditChannelName";
import { ChevronDown, Trash } from "lucide-react";


interface HeaderProps {
    name:string;
}


function Header({name}:HeaderProps) {
  const WorspaceId = useGetWorkspaceId()
  const ChannelId = useGetChannelId()
  const [ChannelDialog, setChannelDialog] = useState(false);

  const [Confirm, ConfirmDialog] = UseConfirm();
  const Router = useRouter()

   const {mutate:Remove,IsPending:IsRemoving} = useRemoveChannel()
  


 const HandleRemove = async () => {

    const Ok = await Confirm()

    if(!Ok) return;

    Remove({id:ChannelId},{
      onSuccess(){
        toast.success("Channel Removed")
        Router.replace(`/workspaces/${WorspaceId}`)
      },
      onError(){
        toast.success("Failed To Remove Channel")
      }
    })
  };

  return (
    <div className="w-full h-12  border-b px-5 py-2 flex items-center gap-2">
      <ConfirmDialog title="Delete Channel?" message="Are You Confirm" />
      <Dialog open={ChannelDialog} onOpenChange={setChannelDialog}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="px-3 outline-none border-none hover:border-none active:border-none hover:outline-none active:outline-none cursor-pointer flex items-center gap-2 rounded-md text-4xl  text-black"
          >
            <p className="truncate text-xl max-w-[300px]"># {name}</p>
            <ChevronDown size={50} className="mt-1 size-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prefrences</DialogTitle>
          </DialogHeader>

          <EditChannelName value={name}>
            <div className="w-full cursor-pointer flex justify-between items-center bg-gray-100 rounded-sm p-2">
              <div className="flex flex-col items-start">
                <p className="text-sm">Workspace Name</p>
                <h1 className="font-semibold"># {name}</h1>
              </div>
              <p className="text-blue-400">Edit</p>
            </div>
          </EditChannelName>

          <Button
            disabled={IsRemoving}
            onClick={HandleRemove}
            variant="outline"
            className="truncate text-destructive bg-gray-100"
          >
            <Trash /> Delete # {name}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}



export default Header;