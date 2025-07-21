import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import Hint from "./Hint";
import Thumbnail from "./Thumbnail";
import Toolbar from "./Toolbar";
import { Id } from "../../convex/_generated/dataModel";
import { Dispatch, SetStateAction } from "react";
import { useMessageReaction } from "@/features/reactions/api/useMessageReact";
import { toast } from "sonner";
import ShowReactions from "./Reactions";
import { ReactionsWithoutMembers } from "@/lib/message.lib";
import ThreadBar from "./ThreadBar";
import { useParentId } from "@/features/thread/store/useParentId";
import UserIcon from "./UserAvatar";
import { useMemberProfileId } from "@/features/member/store/useParentId";

const Renderer = dynamic(() => import("./Renderer"));

interface MessageProps {
  id: Id<"messages">;
  member: Id<"members">;
  isEdit: null | Id<"messages">;
  setEditValue: Dispatch<SetStateAction<string>>;
  setEdit: Dispatch<SetStateAction<Id<"messages"> | null>>;
  setIsCreating: Dispatch<SetStateAction<boolean>>;
  IsCreating: boolean;
  isThread?: boolean;
  content: string; // Pass Quill Delta
  isAuthor: boolean;
  isCompact: boolean;
  image: string | undefined;
  authorName: string | undefined;
  authorImage: string | null;
  creationTime: number;
  updated: number | null;
  reactions: ReactionsWithoutMembers | [];
  threadCount: number;
  threadImage: string | null;
  threadTimestamp: number;
  threadName?: string;
  threadMember?:Id<'members'>
}

const FormatFullTime = (date: Date) =>
  `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM, d, yyyy")} At ${format(date, "h:mm a")}`;

const Message = ({
  id,
  member,
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
  reactions,
  threadCount,
  threadImage,
  threadTimestamp,
  threadName,
  isThread = false,
  threadMember
}: MessageProps) => {
  const { mutate: AddReaction, IsPending: IsReacting } = useMessageReaction();

  const [_,setParentId] = useParentId()
  const [__, setProfileId] = useMemberProfileId();


  function OnThreadBarClick(){
    setProfileId(null)
    setParentId(id)
  }
  
  function OnProfileIconClick(id:Id<'members'>){
    console.log(id)
    if(!id) return;
    setProfileId(id)
    setParentId(null)
  }

  function HandleOnEdit() {
    if (IsCreating) return;
    setEditValue(content);
    setEdit(id);
  }

  function HandleOnReact(Emoji: string) {
    if (IsReacting) return;

    AddReaction(
      {
        messageId: id,
        value: Emoji,
      },
      {
        onSuccess() {
          toast.success("Reacted Successfully");
        },
        onError() {
          toast.error("Failed To React");
        },
        throwError: true,
      }
    );
  }

  if (!isCompact) {
    return (
      <div className="p-2 flex items-start gap-2 hover:bg-slate-100 transition relative group overflow-x-hidden">
        <div className="logo-or shrink-0 w-12 aspect-square flex justify-center items-center">
          <UserIcon member={member} onClick={OnProfileIconClick} name={authorName || ''} image={authorImage} />
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
            {image && !isThread && <Thumbnail url={image} />}
            {updated && <p className="text-sm text-muted-foreground">Edited</p>}
            <ShowReactions reactions={reactions} onChange={HandleOnReact} />
            <ThreadBar
              count={threadCount}
              image={threadImage}
              timestamp={threadTimestamp}
              name={threadName}
              onClick={OnThreadBarClick}
              onProfileClick={OnProfileIconClick}
              member={threadMember}
            />
          </div>
        </div>
        <Toolbar
          isThread={isThread}
          message={id}
          isEdit={isEdit}
          onEdit={HandleOnEdit}
          isAuthor={isAuthor}
          onReact={HandleOnReact}
        />
      </div>
    );
  } else {
    return (
      <div className="p-2 flex items-start gap-2 hover:bg-slate-100 transition relative group overflow-x-hidden">
        <div className="flex gap-2 h-full justify-center items-center pt-2">
          <Hint label={FormatFullTime(new Date(creationTime))}>
            <p className="text-muted-foreground cursor-pointer text-[10px] text-center w-12 opacity-0 group-hover:opacity-100">
              {format(new Date(creationTime), "h:mm a")}
            </p>
          </Hint>
        </div>
        <div className="flex flex-col gap-2">
          <Renderer content={content} />
          {image && !isThread && <Thumbnail url={image} />}
          {updated && <p className="text-sm text-muted-foreground">Edited</p>}
          <ShowReactions reactions={reactions} onChange={HandleOnReact} />
          <ThreadBar
              count={threadCount}
              image={threadImage}
              timestamp={threadTimestamp}
              name={threadName}
              onClick={OnThreadBarClick}
              member={threadMember}
              onProfileClick={OnProfileIconClick}
            />
        </div>
        <Toolbar
          isThread={isThread}
          message={id}
          isCompact
          isEdit={isEdit}
          onEdit={HandleOnEdit}
          isAuthor={isAuthor}
          onReact={HandleOnReact}
        />
      </div>
    );
  }
};

export default Message;
