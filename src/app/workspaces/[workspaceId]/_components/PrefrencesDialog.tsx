import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveWorkSpace } from "@/features/workspace/api/removeWorkspace copy";
import { useUpdateWorkSpace } from "@/features/workspace/api/updateWorkspace";
import UseConfirm from "@/features/workspace/hooks/useConfirm";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useState } from "react";
import { toast } from "sonner";

interface PrefrencesDialogProps {
  open: boolean;
  InitialName: string;
  setOpen:Dispatch<SetStateAction<boolean>>;
}

const PrefrencesDialog = ({
  open,
  setOpen,
  InitialName,
}: PrefrencesDialogProps) => {

  const Router = useRouter()

   const WorkspaceId = useGetWorkspaceId()

  const {mutate:Remove,IsPending:IsRemoving} = useRemoveWorkSpace()

  const [Confirm,ConfirmDialog] = UseConfirm()


 const HandleRemove = async () => {

    const Ok = await Confirm()

    if(!Ok) return;

    Remove({id:WorkspaceId},{
      onSuccess(){
        toast.success("Workspace Removed")
        Router.replace('/')
      },
      onError(){
        toast.success("Failed To Remove Workspace")
      }
    })
  };


  return (
    <>
    <ConfirmDialog title='Delete Workspace' message='Are You Confirm' />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prefrences</DialogTitle>
          </DialogHeader>

          <EditName value={InitialName}>
            <div className="w-full cursor-pointer flex justify-between items-center bg-gray-100 rounded-sm p-2">
              <div className="flex flex-col items-start">
                <p className="text-sm">Workspace Name</p>
                <h1 className="font-semibold">{InitialName}</h1>
              </div>
              <p className="text-blue-400">Edit</p>
            </div>
          </EditName>

          <Button
            onClick={HandleRemove}
            variant="outline"
            className="truncate text-destructive bg-gray-100"
          >
            <Trash /> Delete {InitialName}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

const EditName = ({
  children,
  value,
}: {
  children: ReactNode;
  value: string;
}) => {


  const [IsEditNameOpen, setIsEditNameOpen] = useState(false);
  const [Name, setName] = useState(value);

  const WorkspaceId = useGetWorkspaceId()

  const {mutate:Update,IsPending:IsUpdating} = useUpdateWorkSpace()

  const HandleClose = () => {
    setName(value);
    setIsEditNameOpen(false);
  };

  const HandleUpdate = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    Update({id:WorkspaceId,name:Name},{
      onSuccess(){
        toast.success("Workspace Updated")
        setIsEditNameOpen(false)
      },
      onError(){
        toast.success("Failed To Update Workspace")
      }
    })
  };

  return (
    <Dialog
      key={"Edit-Name-Dialog"}
      open={IsEditNameOpen}
      onOpenChange={setIsEditNameOpen}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Name</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <form onSubmit={HandleUpdate}>
            <Input
              value={Name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Create Workspace ex: 'Project', 'Home', 'Venues'"
              autoFocus
            />
            <div className="w-full flex gap-1 mt-4">
              <Button
                onClick={HandleClose}
                className="w-1/2"
                variant={"outline"}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-1/2" variant={"default"}>
                Save
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrefrencesDialog;
