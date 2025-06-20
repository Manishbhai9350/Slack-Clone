import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetWorkSpace } from "@/features/workspace/api/useGetWorkspace";
import { useWorkspaces } from "@/features/workspace/api/useWorkspaces";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { useWorkspaceAtom } from "@/features/workspace/hooks/useWorkSpace";
import { Loader, Plug, Plus, PlusSquare, PlusSquareIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const SidebarDropDown = () => {
  const [open, setOpen] = useWorkspaceAtom();
  const workspaceId = useGetWorkspaceId();

  const router = useRouter();

  const { Data: Workspaces, IsLoading: IsWorkspacesLoading } = useWorkspaces();
  const { Data: Workspace, IsLoading: IsWorkspaceLoading } = useGetWorkSpace({
    workspaceId,
  });

  function HandleCreateWorkspace(e) {
    setOpen(true);
  }

  const FilteredWorkspaces = useMemo(
    () => Workspaces?.filter((workspace) => workspace._id !== workspaceId),
    [Workspaces]
  );

  if (!Workspace && !IsWorkspaceLoading) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer h-10 aspect-square rounded-sm flex justify-center items-center hover:text-white bg-white/60">
        {IsWorkspaceLoading ? (
          <Loader className="animate-spin transition" />
        ) : (
          <div className={"Icon overflow-hidden text-2xl "}>
            {Workspace?.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[200px]" align="end">
        <DropdownMenuItem>
          <div>
            <h3 className="text-md">{Workspace?.name}</h3>
            <p className="text-xsm">Active Workspace</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {FilteredWorkspaces && FilteredWorkspaces.length > 0 && (
          <div>
            <p className="pl-2">Available Workspaces</p>
            {FilteredWorkspaces?.map((workspace) => (
              <DropdownMenuItem
                onClick={() => router.push(`/workspaces/${workspace._id}`)}
                className="cursor-pointer overflow-hidden pl-2 max-w-[200px] w-full"
                key={workspace._id}
              >
                <div className="w-10 shrink-0 aspect-square bg-slate-700 text-white flex justify-center items-center rounded-md text-2xl">
                  {workspace?.name?.charAt(0).toUpperCase()}
                </div>
                <p className="truncate">{workspace.name}</p>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        <DropdownMenuItem
          onClick={(e) => HandleCreateWorkspace(e)}
          className="cursor-pointer"
        >
          <Plus className="size-10" />
          <p className="text-nd">Create Workspace</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarDropDown;
