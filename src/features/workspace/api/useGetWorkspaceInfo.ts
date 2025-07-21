import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface GetWorkspaceProps {
  workspaceId: Id<"workspaces">;
}

interface workspaceStruct {
  Data:{
    name:string;
    isMember:boolean;
  } | null;
  IsLoading:boolean;
}


export const useGetWorkspaceInfo = ({ workspaceId }: GetWorkspaceProps) : workspaceStruct => {
  try {
    const Data = useQuery(api.workspaces.getInfo, { workspaceId });

    let IsLoading;

    if (typeof Data == "undefined") {
      IsLoading = true;
    } else IsLoading = false;

    return { Data, IsLoading };
  } catch (error) {
    return { Data: null, IsLoading: false,error};
  }
};
