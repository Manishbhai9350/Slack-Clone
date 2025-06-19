import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";
import { Loader, LogOut } from "lucide-react";
import { useUser } from "../api/auth.user";

const  UserAvatar = () => {
  const { signOut } = useAuthActions();

  const { user, isLoading } = useUser();

  if (isLoading)
    return (
      <div className="w-12 aspect-square flex justify-center items-center">
        <Loader className="animate-spin" />
      </div>
    );

  const { name, email } = user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-12 aspect-square">
        <Avatar className="w-full h-full outline-none border-none cursor-pointer">
          <AvatarFallback className="bg-amber-500 text-white text-2xl">
            <p>{name.charAt(0).toUpperCase()}</p>
          </AvatarFallback>
          <AvatarImage
            className="outline-none h-full w-full border-none select-none"
            alt="Avatar"
            src={user?.image}
          />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          className="cursor-pointer size-8 opacity-75 hover:opacity-100 transition"
          onClick={() => signOut()}
        >
          <LogOut className="hover:bg-none " />
          <p>Logout</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
