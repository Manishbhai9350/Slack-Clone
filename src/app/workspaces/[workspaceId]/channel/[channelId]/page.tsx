"use client";

import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useGetChannelId } from "@/features/channels/hooks/useChannelId";
import Header from "./_components/Header";
import { useGetChannel } from "@/features/channels/api/useGetChannel";
import ChatInput from "@/app/workspaces/_components/ChatInput";
import { useGetMessages } from "@/features/messages/api/useGetMessages";
import { groupMessagesByDate } from "@/lib/message.lib";
import Message from "@/components/Message";
import {differenceInSeconds} from 'date-fns';

const TIME_THRESHOLD = 10;

const ChannelPage = () => {
  const workspaceId = useGetWorkspaceId();
  const channelId = useGetChannelId();

  const { Data: Channels, IsLoading: ChannelsLoading } = useGetChannels({
    workspaceId,
  });
  const { Data: ChannelData, IsLoading: ChannelDataLoading } = useGetChannel({
    id: channelId,
  });

  const { messages } = useGetMessages({ channel: channelId });

  console.log(messages);

  const GroupedMessages = groupMessagesByDate(messages);

  const Router = useRouter();

  const Channel = useMemo(() => Channels?.[0]?._id, [Channels]);

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
      <div className="flex-1 max-h-auto overflow-y-scroll">
        <div className="p-4 space-y-6 min-h-full flex flex-col-reverse">
          {GroupedMessages &&
            Object.entries(GroupedMessages).map(([label, group]) => {
              return (
                <div key={label}>
                  <div className="w-full border-b border-gray-400 relative my-4">
                    <div className="absolute p-2 rounded-4xl px-4 top-1/2 left-1/2 -translate-1/2 text-xs bg-white border border-gray-400 text-black/60 uppercase mb-2">
                      {label}
                    </div>
                  </div>
                  <div>
                    {group.reverse().map((msg, i) => {
                      const PrevMessage = group[i - 1];
                      const isCompact =
                        PrevMessage && PrevMessage.member == msg.member && (
                          differenceInSeconds(
                            new Date(msg._creationTime),
                            new Date(PrevMessage._creationTime),
                          ) < TIME_THRESHOLD
                        );
                      console.log(PrevMessage);
                      return (
                        <Message
                          creationTime={msg._creationTime}
                          isCompact={isCompact}
                          authorName={msg?.user?.name}
                          authorImage={msg?.user?.image}
                          key={msg._creationTime}
                          content={msg.message}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <ChatInput />
    </div>
  );
};

export default ChannelPage;
