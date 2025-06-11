import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";
import { useUser } from "../api/auth.user";

const UserAvatar = () => {
  const { signOut } = useAuthActions();

  const { user, isLoading } = useUser();

  if (isLoading)
    return (
      <>
        <p>Loading...</p>
      </>
    );

  const { name, email } = user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-14 outline-none border-none cursor-pointer">
          <AvatarFallback className="bg-amber-500 text-white text-2xl">
            <p>{name.charAt(0).toUpperCase()}</p>
          </AvatarFallback>
          <AvatarImage
            className="outline-none border-none select-none"
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
