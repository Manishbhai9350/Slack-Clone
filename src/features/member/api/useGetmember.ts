/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetMemberProps {
  id: Id<"members">;
}

export const useGetMember = ({ id }: useGetMemberProps) => {
  try {
    const Data = useQuery(api.member.getById, { id });

    let IsLoading;

    if (typeof Data == "undefined") {
      IsLoading = true;
    } else IsLoading = false;

    return { Data, IsLoading };
  } catch (error) {
    return { Data: null, IsLoading: false };
  }
};
