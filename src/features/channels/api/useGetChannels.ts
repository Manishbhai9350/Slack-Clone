import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface GetChannelsProps {
  workspaceId: Id<"workspaces">;
}

export const useGetChannels = ({ workspaceId }: GetChannelsProps) => {
  try {
    const Data = useQuery(api.channels.get, { workspaceId });

    let IsLoading;

    if (typeof Data == "undefined") {
      IsLoading = true;
    } else IsLoading = false;

    return { Data, IsLoading };
  } catch (error) {
    return { Data: null, IsLoading: false,error };
  }
};
