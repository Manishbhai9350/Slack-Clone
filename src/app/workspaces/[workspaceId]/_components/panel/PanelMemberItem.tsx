import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import UserIcon from "@/components/UserAvatar";

interface PanelMemberItemProps {
  isActive?: boolean;
  name: string;
  image: string;
  id:Id<'members'>;
}

const PanelMemberItem = ({
  isActive = false,
  image,
  name,
  id
}: PanelMemberItemProps) => {

  const workspaceId = useGetWorkspaceId();

  return (
    <Link
      href={`/workspaces/${workspaceId}/member/${id}`}
      className={cn(
        "flex justify-between items-center w-full transition-all duration-300 rounded-sm px-2 py-1 my-1",
        isActive
          ? "hover:bg-white/70 hover:text-slate-800 bg-white/70 text-slate-800"
          : "hover:bg-white/70 hover:text-slate-800 text-white"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="w-10 aspect-square">
          <UserIcon name={name} image={image} />
        </div>
        <p className="text-xl truncate">{name}</p>
      </div>
    </Link>
  );
};

export default PanelMemberItem;
