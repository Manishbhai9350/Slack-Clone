import { groupMessagesByDate, MessageType } from "@/lib/message.lib";
import { Loader } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import UseCurrentMember from "@/features/workspace/api/useCurrentMember";
import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useGetChannelId } from "@/features/channels/hooks/useChannelId";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import Message from "./Message";
import { useGetMessages } from "@/features/messages/api/useGetMessages";
import { Id } from "../../convex/_generated/dataModel";
import { differenceInSeconds } from "date-fns";

interface MessageListProps {
  messages: MessageType[];
  variant: "messages" | "threads" | "conversation";
  conversation?: Id<"conversations">;
  parent?: Id<"messages">;
  IsEdit:Id<'messages'> | null;
  setIsEdit:Dispatch<SetStateAction<Id<"messages"> | null>>;
  setEditValue:Dispatch<SetStateAction<string>>;
}

const MessageList = ({ variant, conversation, parent, setIsEdit, IsEdit, setEditValue}: MessageListProps) => {
  const workspaceId = useGetWorkspaceId();
  const channelId = useGetChannelId();

  const [IsCreating, setIsCreating] = useState(false);

  const { Data: Channels, IsLoading: ChannelsLoading } = useGetChannels({
    workspaceId,
  });
  const { Data: CurrentMember } = UseCurrentMember({
    workspace: workspaceId,
  });

  const {
    messages: Messages,
    loadMore,
    status,
  } = useGetMessages({ channel: channelId, conversation, parent });

  const CanLoadMore = useMemo(() => status == "CanLoadMore", [status]);
  const IsLoadingMore = useMemo(() => status == "LoadingMore", [status]);

  const GroupedMessages = groupMessagesByDate(Messages);

  const Router = useRouter();

  const Channel = useMemo(() => Channels?.[0]?._id, [Channels]);

  useEffect(() => {
    if (ChannelsLoading) return;

    if (!Channel) {
      Router.replace(`/workspaces/${workspaceId}`);
    }

    return () => {};
  }, [Channel, ChannelsLoading, Router, workspaceId]);

  if (ChannelsLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-y-2">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="messages-container flex-1 max-h-auto overflow-y-scroll">
      <div className="p-4 space-y-6 min-h-full flex flex-col-reverse">
        {GroupedMessages &&
          Object.entries(GroupedMessages).map(([label, group]) => {
            return (
              <div key={label}>
                <div className="w-full border-b border-gray-400 relative my-6">
                  <div className="absolute p-2 rounded-4xl px-4 top-1/2 left-1/2 -translate-1/2 text-xs bg-white border border-gray-400 text-black/60 uppercase mb-2">
                    {label}
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  {group.reverse().map((msg, i) => {
                    const PrevMessage = group[i - 1];
                    const isCompact =
                      PrevMessage &&
                      PrevMessage?.member?._id == msg?.member?._id &&
                      differenceInSeconds(
                        new Date(msg._creationTime),
                        new Date(PrevMessage._creationTime)
                      ) < 20;
                      console.log(msg.threadMember)
                    return (
                      <Message
                        id={msg._id}
                        IsCreating={IsCreating}
                        setIsCreating={setIsCreating}
                        setEditValue={setEditValue}
                        isEdit={IsEdit}
                        setEdit={setIsEdit}
                        isAuthor={msg?.member?._id == CurrentMember?._id}
                        image={msg.image}
                        creationTime={msg._creationTime}
                        isCompact={isCompact}
                        authorName={msg?.user?.name}
                        authorImage={msg?.user?.image || ""}
                        key={msg._creationTime}
                        content={msg.message}
                        updated={msg.updated}
                        reactions={msg.reactions || []}
                        isThread={variant == 'threads'}
                        threadCount={msg.threadCount}
                        threadImage={msg.threadImage}
                        threadTimestamp={msg.threadTimestamp}
                        threadName={msg.threadName}
                        threadMember={msg.threadMember}
                        member={msg?.member?._id}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

        {IsLoadingMore && (
          <div className="w-full border-b border-gray-400 relative my-6">
            <div className="absolute p-2 rounded-4xl px-4 top-1/2 left-1/2 -translate-1/2 text-xs bg-white border border-gray-400 text-black/60 uppercase mb-2">
              <Loader className="size-4 animate-spin" />
            </div>
          </div>
        )}
        <div
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                (entries) => {
                  if (
                    entries &&
                    entries.length > 0 &&
                    entries[0].isIntersecting &&
                    CanLoadMore
                  ) {
                    loadMore();
                  }
                },
                {
                  threshold: 1.0,
                }
              );

              observer.observe(el);

              return () => observer.disconnect();
            }
          }}
          className="load-more-observer"
        />
      </div>
    </div>
  );
};

export default MessageList;
