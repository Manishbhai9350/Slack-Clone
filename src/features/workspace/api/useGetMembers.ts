/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface GetWorkspaceProps {
  workspaceId: Id<"workspaces">;
}

export const useGetMembers = ({ workspaceId }: GetWorkspaceProps) => {
  try {
    const Data = useQuery(api.member.get, { workspaceId });

    let IsLoading;

    if (typeof Data == "undefined") {
      IsLoading = true;
    } else IsLoading = false;

    return { Data, IsLoading };
  } catch (error) {
    return { Data: null, IsLoading: false };
  }
};
