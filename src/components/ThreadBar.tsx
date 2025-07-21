import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";
import UserIcon from "./UserAvatar";
import { Id } from "../../convex/_generated/dataModel";

interface ThreadBarProps {
  member:Id<'members'>,
  count?: number;
  image?: string | null;
  timestamp?: number;
  name?: string;
  onClick: () => void;
  onProfileClick?: () => void;
}


const ThreadBar = ({
  member,
  count,
  image,
  name = "Member",
  timestamp = 0,
  onClick,
  onProfileClick
}: ThreadBarProps) => {
  if (!count || !name) return null;
  return (
    <div
      className="bg-white w-[600px]  cursor-pointer rounded-sm p-1 flex justify-start items-center gap-2 group/thread-bar"
    >
      <div className="w-10 aspect-square">
        <UserIcon onClick={onProfileClick} member={member} name={name || ""} image={image} />
      </div>

      
      <p onClick={onClick} className="text-md  hover:underline text-blue-500">
        {count}
        {count > 1 ? " Replies" : " Reply"}
      </p>
      <p className="text-xs text-muted-foreground group-hover/thread-bar:hidden block">
        Last reply {" "}
        {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
      </p>
      <p className="text-xs text-muted-foreground group-hover/thread-bar:block hidden">
        View threads
      </p>
      <div className="text-muted-foreground flex-1 flex justify-end px-1 items-center h-full group-hover/thread-bar:opacity-100 opacity-0 transition duration-200">
        <ChevronRight />
      </div>
    </div>
  );
};

export default ThreadBar;
