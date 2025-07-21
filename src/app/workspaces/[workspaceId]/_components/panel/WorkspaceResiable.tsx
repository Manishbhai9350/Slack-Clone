import {
  AlertTriangle,
  ChevronDown,
  Hash,
  Loader,
  MessageSquareText,
  Plus,
  SendHorizonal
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Doc, Id } from "../../../../../../convex/_generated/dataModel";
import { ReactNode, useState } from "react";
import { useGetWorkSpace } from "@/features/workspace/api/useGetWorkspace";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";

import { Button } from "@/components/ui/button";
import PrefrencesDialog from "../PrefrencesDialog";
import UseCurrentMember from "@/features/workspace/api/useCurrentMember";
import PanelItem from "./PanelItem";
import PanelItemSection from "./PanelItemSection";
import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useGetMembers } from "@/features/workspace/api/useGetMembers";
import PanelMemberItem from "./PanelMemberItem";
import { useChannelAtom } from "@/features/channels/hooks/useChannel";
import InviteModal from "./InviteModal";
import ChannelItem from "./ChannelItem";
import { useParentId } from "@/features/thread/store/useParentId";
import Thread from "@/components/Thread";
import { useGetOtherMemberId } from "@/features/conversation/hooks/useGetOtherMember";
import { useMemberProfileId } from "@/features/member/store/useParentId";
import Profile from "@/features/member/components/Profile";

export default function WorkspacePanel({ children }: { children: ReactNode }) {


  const [parentId, setParentId] = useParentId();
  const [profileId, setProfileId] = useMemberProfileId();


  function onPanelCancel(){
    setParentId(null)
    setProfileId(null)
  }


  const IsPanelOpen = !!parentId || !!profileId;

  return (
    <ResizablePanelGroup
      autoSaveId={"workspace-resiable-panel"}
      direction="horizontal"
      className="w-full h-full overflow-y-scroll"
    >
      <ResizablePanel
        className="md:min-w-[270px] min-h-full"
        defaultSize={20}
        minSize={20}
        maxSize={35}
        order={1}
      >
        <PanelSideBar />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        collapsible
        collapsedSize={10}
        defaultSize={50}
        order={2}
        minSize={10}
        color="#313131"
      >
        {children}
      </ResizablePanel>
      {IsPanelOpen && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel
            order={3}
            defaultSize={40}
            minSize={40}
            maxSize={45}
            color="#313131"
          >
            {
              parentId && (
                <Thread onCancel={onPanelCancel} message={parentId as Id<'messages'>} />
              )
            } 
            {
              profileId && (
                <Profile onCancel={onPanelCancel} member={profileId as Id<'members'>} />
              )
            }
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}

function PanelSideBar() {
  const workspaceId = useGetWorkspaceId();


  const [_, setOpen] = useChannelAtom();

  const { Data: Workspace, IsLoading: WorkspaceLoading } = useGetWorkSpace({
    workspaceId,
  });
  const { Data: Channels, IsLoading: ChannelsLoading } = useGetChannels({
    workspaceId,
  });
  const { Data: Member, IsLoading: MemberLoading } = UseCurrentMember({
    workspace:workspaceId
  });
  const { Data: Members } = useGetMembers({
    workspaceId,
  });
  const OtherMemberId = useGetOtherMemberId()

  if (WorkspaceLoading || MemberLoading) {
    return <Loader className="animate-spin transition" />;
  }

  if (!Workspace || !Member) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-full bg-slate-600 ">
      <PanelSideBarHeader member={Member} workspace={Workspace} />
      <PanelItemSection>
        <PanelItem  icon={MessageSquareText} label="Threads" />
        <PanelItem icon={SendHorizonal} label="Drafts & Sent" />
      </PanelItemSection>
      <PanelItemSection
        opened
        endHint="Add Channels"
        onEnd={() => setOpen(true)}
        end={Plus}
        role={Member.role}
        seperator
        label="channels"
        toggle
      >
        {ChannelsLoading && <Loader className="animate-spin" />}
        {Channels &&
          Channels.length > 0 &&
          Channels.map((Item) => (
            <ChannelItem
              key={Item._id}
              id={Item._id}
              icon={Hash}
              label={Item.name}
            />
          ))}
      </PanelItemSection>
      <PanelItemSection
        opened
        endHint="Add New DM"
        onEnd={() => {}}
        end={Plus}
        role={Member.role}
        seperator
        label="Direct Messages"
        toggle
      >
        {MemberLoading && <Loader className="animate-spin" />}
        {Members?.length == 0 && !MemberLoading && (
          <>
            <p>Unable To Find Members</p>
            <AlertTriangle />
          </>
        )}
        {Members &&
          Members.length > 0 &&
          Members.map((Item) => (
            <PanelMemberItem
              key={Item._id}
              isActive={Item._id == OtherMemberId}
              name={Item.User?.name}
              image={Item.User?.image}
              id={Item._id}
            />
          ))}
      </PanelItemSection>
    </div>
  );
}

interface PanelHeaderProps {
  workspace: Doc<"workspaces">;
  member: Doc<"members">;
}

function PanelSideBarHeader({
  workspace,
  member,
}: PanelHeaderProps): ReactNode {
  const [PrefrencesOpen, setPrefrencesOpen] = useState(false);
  const [InviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <div className="header m-2 my-4 w-full px-2 flex items-center gap-2">
      <PrefrencesDialog
        InitialName={workspace.name}
        setOpen={setPrefrencesOpen}
        open={PrefrencesOpen}
      />
      <InviteModal
        name={workspace.name}
        joinCode={workspace.joinCode}
        open={InviteModalOpen}
        setOpen={setInviteModalOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="px-3 outline-none border-none hover:border-none active:border-none hover:outline-none active:outline-none cursor-pointer flex items-center gap-2 rounded-md text-4xl  text-white"
          >
            <p className="truncate text-xl max-w-[100px]">{workspace.name}</p>
            <ChevronDown size={50} className="mt-1 size-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[250px]">
          <DropdownMenuItem className="cursor-pointer overflow-hidden ">
            <div className="w-10 shrink-0 aspect-square bg-slate-700 text-white flex justify-center items-center rounded-md text-2xl">
              {workspace?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="truncate font-bold">{workspace.name}</h1>
              <p className="truncate">Active Workspace</p>
            </div>
          </DropdownMenuItem>
          {member.role == "admin" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setInviteModalOpen(true)}
                className="cursor-pointer overflow-hidden "
              >
                <p className="truncate">Invite People To {workspace.name}</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setPrefrencesOpen(!PrefrencesOpen)}
                className="cursor-pointer overflow-hidden "
              >
                <p className="truncate">Prefrences</p>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
