import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface ThreadBarProps {
  count?: number;
  image?: string | null;
  timestamp?: number;
  name?: string;
  onClick:() => void;
}

const colors = [
    "bg-amber-500 text-white",
    "bg-blue-500 text-white",
    "bg-yellow-500 text-white",
    "bg-purple-700 text-white"
]

const ThreadBar = ({
    count,
    image,
    name = 'Member',
    timestamp = 0,
    onClick
}:ThreadBarProps) => {
    const avatarFallback = name?.charAt(0).toUpperCase()
    const colorIndex = name.length % colors.length;
    if(!count || !name) return null;
  return (
    <div onClick={onClick} className="bg-white w-[600px]  cursor-pointer rounded-sm p-1 flex justify-start items-center gap-2 group/thread-bar">
        <Avatar className={cn(colors[colorIndex || 0])}>
            <AvatarImage src={image} alt="Avatar Image" />
            <AvatarFallback className="bg-transparent">{avatarFallback}</AvatarFallback>
        </Avatar>
        <p className="text-md text-blue- hover:underline text-blue-500">
            {
                count
            }
            {
                count > 1 ? ' Replies' : ' Reply'
            }
        </p>
        <p className="text-xs text-muted-foreground group-hover/thread-bar:hidden block">
            Last reply about {formatDistanceToNow(new Date(timestamp),{addSuffix:true})}
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
