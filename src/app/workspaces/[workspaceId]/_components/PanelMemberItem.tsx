import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PanelMemberItemProps {
  isActive?: boolean;
  name: string;
  image: string;
}

const PanelMemberItem = ({
  isActive = false,
  image,
  name,
}: PanelMemberItemProps) => {
  return (
    <Link
      href=""
      className={cn(
        "flex justify-between items-center w-full transition-all duration-300 rounded-sm px-2 py-1",
        isActive
          ? "hover:bg-white/70 hover:text-slate-800 bg-white/70 text-slate-800"
          : "hover:bg-white/70 hover:text-slate-800 text-white"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Avatar>
          <AvatarFallback className="bg-amber-500 text-white text-2xl">
            <p>{name.charAt(0).toUpperCase()}</p>
          </AvatarFallback>
          <AvatarImage
            className="outline-none h-full w-full border-none select-none"
            alt="Avatar"
            src={image}
          />
        </Avatar>
        <p className="text-xl">{name}</p>
      </div>
    </Link>
  );
};

export default PanelMemberItem;
