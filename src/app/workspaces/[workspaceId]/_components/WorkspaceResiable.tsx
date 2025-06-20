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
import { Doc } from "../../../../../convex/_generated/dataModel";
import { ReactNode } from "react";
import { useGetWorkSpace } from "@/features/workspace/api/useGetWorkspace";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { ChevronDown, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import UseCurrentMember from "@/features/workspace/api/useCurrentMember";

export default function WorkspacePanel() {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-full">
      <ResizablePanel defaultSize={50} minSize={20} order={1}>
        <PanelSideBar />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} order={2} minSize={10} color="#313131">
        <div className="flex  items-center justify-center p-6">
          <span className="font-semibold">Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function PanelSideBar() {
  const workspaceId = useGetWorkspaceId();
  const { Data: Workspace, IsLoading: WorkspaceLoading } = useGetWorkSpace({
    workspaceId,
  });
  const { Data: Member, IsLoading: MemberLoading } = UseCurrentMember({
    workspaceId,
  });

  if (WorkspaceLoading || MemberLoading) {
    return <Loader className="animate-spin transition" />;
  }

  if (!Workspace || !Member) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-1 w-full h-full bg-slate-600">
      <PanelSideBarHeader member={Member} workspace={Workspace} />
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
  return (
    <div className="header m-2 my-4 w-full px-2 flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="px-3 outline-none border-none hover:border-none active:border-none hover:outline-none active:outline-none cursor-pointer flex items-center gap-2 rounded-md text-4xl  text-white"
          >
            <p className="truncate text-xl">{workspace.name}</p>
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
              <DropdownMenuItem className="cursor-pointer overflow-hidden ">
                <p className="truncate">Invite People To {workspace.name}</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer overflow-hidden ">
                <p className="truncate">Prefrences</p>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
