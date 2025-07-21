import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";
import { Loader, LogOut } from "lucide-react";
import { useUser } from "../api/auth.user";
import UserIcon from "@/components/UserAvatar";

const  UserAvatar = () => {
  const { signOut } = useAuthActions();

  const { user, isLoading } = useUser();

  if (isLoading)
    return (
      <div className="w-12 aspect-square flex justify-center items-center">
        <Loader className="animate-spin" />
      </div>
    );


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-12 aspect-square">
          <UserIcon name={user?.name || ''} image={user?.image || ''} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          className="cursor-pointer size-8 opacity-75 hover:opacity-100 transition"
          onClick={() => signOut()}
        >
          <LogOut className="hover:bg-none" />
          <p>Logout</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
