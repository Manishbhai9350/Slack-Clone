"use client";

import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import {  useEffect, useMemo } from "react";
import { useGetChannelId } from "@/features/channels/hooks/useChannelId";
import Header from "./_components/Header";
import { useGetChannel } from "@/features/channels/api/useGetChannel";

const ChannelPage = () => {
  const workspaceId = useGetWorkspaceId();
  const channelId = useGetChannelId()

  const { Data: Channels, IsLoading: ChannelsLoading } = useGetChannels({
    workspaceId,
  });  
  const { Data: ChannelData, IsLoading: ChannelDataLoading } = useGetChannel({
    id:channelId,
  });  

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
    <div className="w-full h-full">
      <Header name={ChannelData?.name || ''} />
    </div>
  );
};


export default ChannelPage;
