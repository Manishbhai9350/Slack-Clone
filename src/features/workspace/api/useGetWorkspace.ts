import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useMemo } from "react";
import { Id } from "../../../../convex/_generated/dataModel";


interface GetWorkspaceProps {
  workspaceId:Id<'workspaces'>;
}

export const useGetWorkSpace = ({ workspaceId }: GetWorkspaceProps) => {
  const Data = useQuery(api.workspaces.getWorkspace, { workspaceId });
  
  const IsLoading = useMemo(() => {
    if (typeof Data == "undefined") {
      return true;
    } else return false;
  }, [Data]);

  return { Data, IsLoading };
};
