import { Button } from "@/components/ui/button";
import UserIcon from "@/components/UserAvatar";
import { ChevronDown } from "lucide-react";

interface HeaderProps {
  name: string | null | undefined;
  memberImage: string | undefined;
  onClick:() => void;
}

function Header({ name, memberImage, onClick }: HeaderProps) {


  return (
    <div onClick={onClick} className="w-full h-12 px-5 border-b flex items-center gap-2">
      <Button
        variant="outline"
        className="outline-none border-none hover:border-none active:border-none hover:outline-none active:outline-none cursor-pointer flex items-center gap-2 rounded-md text-4xl  text-black"
      >
        <div className="h-8 aspect-square">
          <UserIcon name={name || ''} image={memberImage} />
        </div>
        <p className="truncate text-xl max-w-[300px]"># {name}</p>
        <ChevronDown size={50} className="mt-1 size-6" />
      </Button>
      {/* <ConfirmDialog title="Delete Channel?" message="Are You Confirm" />
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
      </Dialog> */}
    </div>
  );
}

export default Header;
