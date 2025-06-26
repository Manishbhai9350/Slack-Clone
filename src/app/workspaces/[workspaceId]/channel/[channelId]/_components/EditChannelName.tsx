import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateChannel } from "@/features/channels/api/updateChannel";
import { useGetChannelId } from "@/features/channels/hooks/useChannelId";
import { FormEvent, ReactNode, useState } from "react";
import { toast } from "sonner";

 const EditChannelName = ({
  children,
  value,
}: {
  children: ReactNode;
  value: string;
}) => {


  const [IsEditNameOpen, setIsEditNameOpen] = useState(false);
  const [Name, setName] = useState(value);

  const ChannelId = useGetChannelId()
    const {mutate:Update,IsPending:IsUpdating} = useUpdateChannel()
  
  const HandleClose = () => {
    setName(value);
    setIsEditNameOpen(false);
  };
  
  
function HandleOnInput(e:React.ChangeEvent<HTMLInputElement>){
    const value = e.target.value.replace(/\s+/g,'-').toLowerCase()
    setName(value)
}

  const HandleUpdate = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    Update({id:ChannelId,name:Name},{
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
              onChange={HandleOnInput}
              placeholder="Create Workspace ex: 'Project', 'Home', 'Venues'"
              disabled={IsUpdating}
              autoFocus
            />
            <div className="w-full flex gap-1 mt-4">
              <Button
                disabled={IsUpdating}
                onClick={HandleClose}
                className="w-1/2"
                variant={"outline"}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={IsUpdating} type="submit" className="w-1/2" variant={"default"}>
                Save
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default EditChannelName