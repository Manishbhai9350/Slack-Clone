import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface GetThreadProps {
  id: Id<"messages">;
}

export const useGetThread = ({ id }: GetThreadProps) => {
  try {
    const Data = useQuery(api.messages.getById, { id });

    let IsLoading;

    if (typeof Data == "undefined") {
      IsLoading = true;
    } else IsLoading = false;

    return { Data, IsLoading };
  } catch (error) {
    return { Data: null, IsLoading: false };
  }
};
