"use client";

import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useGetChannelId } from "@/features/channels/hooks/useChannelId";
import Header from "./_components/Header";
import { useGetChannel } from "@/features/channels/api/useGetChannel";
import ChatInput from "@/app/workspaces/_components/ChatInput";
import { useGetMessages } from "@/features/messages/api/useGetMessages";
import { groupMessagesByDate } from "@/lib/message.lib";
import Message from "@/components/Message";
import { differenceInSeconds } from "date-fns";
import UseCurrentMember from "@/features/workspace/api/useCurrentMember";
import { useUpdateMessage } from "@/features/messages/api/useUpdateMessage";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useGetReactions } from "@/features/reactions/api/useGetMembers";

const TIME_THRESHOLD = 30;

const ChannelPage = () => {
  const workspaceId = useGetWorkspaceId();
  const channelId = useGetChannelId();

  const [IsEdit, setIsEdit] = useState<Id<"messages"> | null>(null);
  const [EditValue, setEditValue] = useState<string>("");

  const [IsCreating, setIsCreating] = useState(false);

  const { Data: Channels, IsLoading: ChannelsLoading } = useGetChannels({
    workspaceId,
  });
  const { Data: ChannelData, IsLoading: ChannelDataLoading } = useGetChannel({
    id: channelId,
  });
  const { Data: CurrentMember, IsLoading: CurrentMemberLoading } =
    UseCurrentMember({ workspaceId: workspaceId });

  const { mutate: UpdateMessage, IsPending: UpdatingMessage } =
    useUpdateMessage();

  const {
    messages,
    loadMore,
    status,
    isLoading: IsMessagesLoading,
  } = useGetMessages({ channel: channelId });

  const CanLoadMore = useMemo(() => status == "CanLoadMore", [status]);
  const IsLoadingMore = useMemo(() => status == "LoadingMore", [status]);

  const GroupedMessages = groupMessagesByDate(messages);

  const Router = useRouter();

  const Channel = useMemo(() => Channels?.[0]?._id, [Channels]);

  function HandleUpdate(value: string) {
    if (!value || value.length == 0 || !IsEdit) return;
    UpdateMessage(
      {
        value,
        message: IsEdit,
      },
      {
        onSuccess() {
          toast.success("Message Updated Successfully");
          HandleUpdateCancel();
        },
        onError() {
          toast.error("Failed To Update Message");
        },
        throwError: true,
      }
    );
  }

  function HandleUpdateCancel() {
    setIsEdit(null);
    setEditValue("");
  }

  useEffect(() => {
    if (ChannelsLoading) return;

    if (!Channel) {
      Router.replace(`/workspaces/${workspaceId}`);
    }

    return () => {};
  }, [Channel, ChannelsLoading, Router, workspaceId]);

  if (ChannelsLoading || ChannelDataLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-y-2">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Header name={ChannelData?.name || ""} />
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
                        PrevMessage?.member?.id == msg?.member?.id &&
                        differenceInSeconds(
                          new Date(msg._creationTime),
                          new Date(PrevMessage._creationTime)
                        ) < TIME_THRESHOLD;
                      return (
                        <Message
                          id={msg!._id}
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
                          authorImage={msg?.user?.image || ''}
                          key={msg._creationTime}
                          content={msg.message}
                          updated={msg.updated}
                          reactions={msg.reactions || []}
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
                      loadMore()
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
      <ChatInput
        IsCreating={IsCreating}
        setIsCreating={setIsCreating}
        updatePending={UpdatingMessage}
        onUpdateCancel={HandleUpdateCancel}
        onUpdate={HandleUpdate}
        isEdit={IsEdit}
        editValue={EditValue}
      />
    </div>
  );
};

export default ChannelPage;
