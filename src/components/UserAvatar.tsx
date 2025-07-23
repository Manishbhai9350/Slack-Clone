import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Id } from "../../convex/_generated/dataModel";
import { GetProfileBackground } from "@/lib/utils";

interface UserIconProps {
  name: string;
  image?: string | null;
  onClick?: (id:Id<'members'>) => void;
  member?: string | Id<"members">;
  xl?:boolean;
}


const UserIcon = ({ name, image, onClick = () => {}, member, xl }: UserIconProps) => {

  return (
    <Avatar
      onClick={() => {
        if (member && typeof member !== 'string') {
          onClick(member);
        }
      }}
      className="rounded-sm w-full h-full outline-none border-none cursor-pointer select-none"
    >
      <AvatarFallback className={`${GetProfileBackground(name)} text-white ${xl ? 'text-8xl' : 'text-2xl'}`}>
        <p>{name.charAt(0).toUpperCase()}</p>
      </AvatarFallback>
      <AvatarImage
        className="outline-none h-full w-full border-none select-none"
        alt="Avatar"
        src={image || ''}
      />
    </Avatar>
  );
};

export default UserIcon;
