import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { useGetChannelId } from "@/features/channels/hooks/useChannelId";

interface ChannelItemProps {
  isActive?: boolean;
  icon: LucideIcon;
  label: string;
  id:Id<'channels'>;
}

const ChannelItem = ({ isActive = false, icon: Icon, label, id }: ChannelItemProps) => {
  const workspaceId = useGetWorkspaceId();
  const channelId = useGetChannelId()



  return (
    <Link
      href={`/workspaces/${workspaceId}/channel/${id}`}
      className={cn(
        "my-1 flex justify-between items-center w-full transition-all duration-300 rounded-sm px-2 py-1",
        (id == channelId)
          ? "hover:bg-white/70 hover:text-slate-800 bg-white/70 text-slate-800"
          : "hover:bg-white/70 hover:text-slate-800 text-white"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Icon className="size-5" />

        <p className="text-xl">{label}</p>
      </div>
    </Link>
  );
};

export default ChannelItem;
