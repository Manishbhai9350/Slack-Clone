import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetWorkSpace } from "@/features/workspace/api/useGetWorkspace";
import { useWorkspaces } from "@/features/workspace/api/useWorkspaces";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const SidebarDropDown = () => {
  const workspaceId = useGetWorkspaceId();

  const router = useRouter()

  const { Data: Workspaces, IsLoading: IsWorkspacesLoading } = useWorkspaces();
  const { Data: Workspace, IsLoading: IsWorkspaceLoading } = useGetWorkSpace({
    workspaceId,
  });

  const FilteredWorkspaces = useMemo(
    () => Workspaces?.filter((workspace) => workspace._id !== workspaceId),
    [Workspaces]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer ">
        {!Workspace ? (
          <Loader className="animate-spin transition" />
        ) : (
          <div
            className={
              "Icon max-w-[200px] truncate overflow-hidden text-2xl rounded-sm flex justify-center items-center h-10 aspect-square hover:text-white bg-white/60"
            }
          >
            {Workspace?.name.charAt(0).toUpperCase()}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <div>
            <h3 className="text-md">{Workspace?.name}</h3>
            <p className="text-xsm">Active Workspace</p>
          </div>
        </DropdownMenuItem>
          {
            FilteredWorkspaces?.map(workspace => (
              <DropdownMenuItem onClick={() => router.push(`/workspaces/${workspace._id}`)} className="cursor-pointer overflow-hidden max-w-[200px]" key={workspace._id}>
                <div className="w-10 shrink-0 aspect-square bg-slate-700 text-white flex justify-center items-center rounded-md text-2xl">
                  {Workspace?.name.charAt(0).toUpperCase()}
                </div>
                <p className="truncate">{workspace.name}</p>
              </DropdownMenuItem>
            ))
          }
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarDropDown;
