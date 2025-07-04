import dynamic from "next/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format, isToday, isYesterday } from "date-fns";
import Hint from "./Hint";
import Thumbnail from "./Thumbnail";
import Toolbar from "./Toolbar";
import { Id } from "../../convex/_generated/dataModel";
import { Dispatch, SetStateAction } from "react";

const Renderer = dynamic(() => import("./Renderer"));

interface MessageProps {
  id: Id<"messages">;
  isEdit: null | Id<"messages">;
  setEditValue: Dispatch<SetStateAction<string>>;
  setEdit: Dispatch<SetStateAction<Id<"messages"> | null>>;
  setIsCreating: Dispatch<SetStateAction<boolean>>;
  IsCreating: boolean;
  content: string; // Pass Quill Delta
  isAuthor: boolean;
  isCompact: boolean;
  image: string;
  authorName: string;
  authorImage: string | null;
  creationTime: number;
  updated: number | null;
}

const FormatFullTime = (date: Date) =>
  `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM, d, yyyy")} At ${format(date, "h:mm a")}`;

const Message = ({
  id,
  content,
  isCompact = false,
  authorImage,
  authorName,
  creationTime,
  image,
  isAuthor,
  setEditValue,
  isEdit,
  setEdit,
  IsCreating,
  updated,
  setIsCreating,
}: MessageProps) => {

  
  function HandleOnEdit() {
    if (IsCreating) return;
    setEditValue(content);
    setEdit(id);
  }

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
            <h1 className="font-bold text-xl text-black">{authorName}</h1>
            <Hint label={FormatFullTime(new Date(creationTime))}>
              <p className="text-muted-foreground cursor-pointer text-xs opacity-0 group-hover:opacity-100">
                {format(new Date(creationTime), "h:mm a")}
              </p>
            </Hint>
          </div>
          <div className="flex flex-col gap-2">
            <Renderer content={content} />
            {image && <Thumbnail url={image} />}
            {updated && <p className="text-sm text-muted-foreground">Edited</p>}
          </div>
        </div>
        <Toolbar
          message={id}
          isEdit={isEdit}
          onEdit={HandleOnEdit}
          isAuthor={isAuthor}
        />
      </div>
    );
  } else {
    return (
      <div className="p-2 flex items-start gap-2 hover:bg-slate-100 transition relative group">
        <div className="flex gap-2 h-full justify-center items-center pt-2">
          <Hint label={FormatFullTime(new Date(creationTime))}>
            <p className="text-muted-foreground cursor-pointer text-xs text-center w-12 opacity-0 group-hover:opacity-100">
              {format(new Date(creationTime), "h:mm a")}
            </p>
          </Hint>
        </div>
        <div className="flex flex-col gap-2">
          <Renderer content={content} />
          {image && <Thumbnail url={image} />}
          {updated && <p className="text-sm text-muted-foreground">Edited</p>}
        </div>
        <Toolbar
          message={id}
          isCompact
          isEdit={isEdit}
          onEdit={HandleOnEdit}
          isAuthor={isAuthor}
        />
      </div>
    );
  }
};

export default Message;
