import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface GetWorkspaceProps {
  id: Id<"channels">;
}

export const useGetChannel = ({ id }: GetWorkspaceProps) => {
  try {
    const Data = useQuery(api.channels.getById, { id });

    let IsLoading;

    if (typeof Data == "undefined") {
      IsLoading = true;
    } else IsLoading = false;

    return { Data, IsLoading };
  } catch (error) {
    return { Data: null, IsLoading: false,error };
  }
};
