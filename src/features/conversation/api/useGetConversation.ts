import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface GetConversationProps {
  id: Id<"conversations">;
}

export const useGetConversation = ({ id }: GetConversationProps) => {
  try {
    const Data = useQuery(api.conversation.getById, { id });

    let IsLoading;

    if (typeof Data == "undefined") {
      IsLoading = true;
    } else IsLoading = false;

    return { Data, IsLoading };
  } catch (error) {
    return { Data: null, IsLoading: false, error };
  }
};
