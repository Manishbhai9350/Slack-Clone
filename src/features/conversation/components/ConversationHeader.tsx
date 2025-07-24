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
          <UserIcon  name={name || ''} image={memberImage} />
        </div>
        <p className="truncate text-xl max-w-[300px]"># {name}</p>
        <ChevronDown size={50} className="mt-1 size-6" />
      </Button>
    </div>
  );
}

export default Header;
