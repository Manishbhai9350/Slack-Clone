"use client";
import { Loader, TriangleAlert } from "lucide-react";
import { useGetWorkSpace } from "../api/useGetWorkspace";
import { useGetWorkspaceId } from "../hooks/useGetWorkspaceId";
import { useChannelAtom } from "@/features/channels/hooks/useChannel";
import { useGetChannels } from "@/features/channels/api/useGetChannels";
import UseCurrentMember from "../api/useCurrentMember";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetMessages } from "@/features/messages/api/useGetMessages";

const WorkSpacePage = () => {
  const workspaceId = useGetWorkspaceId();
  const { Data, IsLoading } = useGetWorkSpace({ workspaceId });

  const [createChannelOpen, setCreateChannelOpen] = useChannelAtom();

  const { Data: Workspace, IsLoading: WorkspaceLoading } = useGetWorkSpace({
    workspaceId,
  });
  const { Data: Channels, IsLoading: ChannelsLoading } = useGetChannels({
    workspaceId,
  });
  const { Data: Member, IsLoading: MemberLoading } = UseCurrentMember({
    workspaceId,
  });


  const Router = useRouter()

  const Channel = useMemo(() => Channels?.[0]?._id, [Channels]);
  const IsAdmin = useMemo(() => Member?.role == "admin", [Member]);

  useEffect(() => {
    
    if (
      MemberLoading ||
      ChannelsLoading ||
      WorkspaceLoading
    ) return;

    if(Channel) {
      Router.push(`/workspaces/${workspaceId}/channel/${Channel}`)
    } 

    if (IsAdmin && !Channel && !createChannelOpen) {
      setCreateChannelOpen(true);
    } else if (!IsAdmin && !Channel) {
      setCreateChannelOpen(false);
    }

    return () => {};
  }, [
    Channel,
    MemberLoading,
    ChannelsLoading,
    WorkspaceLoading,
    Workspace,
    Member,
    IsAdmin,
    createChannelOpen,
    setCreateChannelOpen,
    Router,
  workspaceId
  ]);

  if (MemberLoading || ChannelsLoading || WorkspaceLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-y-2">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!Workspace) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-y-2">
        <p className="text-muted-foreground">Workspace Not Found</p>
        <TriangleAlert />
      </div>
    );
  }
  if (!IsAdmin && !Channel) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-y-2">
        <p className="text-muted-foreground">Channel Not Found</p>
        <TriangleAlert />
      </div>
    );
  }

  return <>{JSON.stringify(Data)}</>;
};

export default WorkSpacePage;
