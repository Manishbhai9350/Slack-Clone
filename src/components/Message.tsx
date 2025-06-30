import dynamic from "next/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format, isToday, isYesterday } from "date-fns";
import Hint from "./Hint";

const Renderer = dynamic(() => import("./Renderer"));

interface MessageProps {
  content: string; // Pass Quill Delta
  isCompact: boolean;
  authorName: string;
  authorImage: string | null;
  creationTime: number;
}

const FormatFullTime = (date: Date) =>
  `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM, d, yyyy")} At ${format(date, "h:mm a")}`;

const Message = ({
  content,
  isCompact = false,
  authorImage,
  authorName,
  creationTime,
}: MessageProps) => {
  if (!isCompact) {
    return (
      <div className="p-2 flex items-start gap-2 hover:bg-slate-100 transition relative group">
        <div className="logo-or w-12 aspect-square flex justify-center items-center">
          <Avatar className="rounded-sm w-full h-full ">
            <AvatarFallback className="bg-amber-500 text-white text-2xl">
              <p>{authorName.charAt(0).toUpperCase()}</p>
            </AvatarFallback>
            <AvatarImage
              className="outline-none h-full w-full border-none select-none rounded-sm"
              alt="Avatar"
              src={authorImage}
            />
          </Avatar>
        </div>
        <div className="flex flex-col">
          <div className="name-time flex items-center gap-2">
            <h1 className="font-bold text-black">Meow Meow</h1>
            <Hint label={FormatFullTime(new Date(creationTime))}>
              <p className="text-muted-foreground text-xs opacity-0 group-hover:opacity-100">
                {format(new Date(creationTime), "h:mm a")}
              </p>
            </Hint>
          </div>
          <Renderer content={content} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="p-2 flex items-start gap-2 hover:bg-slate-100 transition relative group">
        <div className="logo-or flex gap-2 h-full justify-center items-center">
          <Hint label={FormatFullTime(new Date(creationTime))}>
            <p className="text-muted-foreground text-xs text-center w-12 opacity-0 group-hover:opacity-100">
              {format(new Date(creationTime), "h:mm a")}
            </p>
          </Hint>
          <Renderer content={content} />
        </div>
      </div>
    );
  }
};

export default Message;
