import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface GetWorkspaceProps {
  channel: Id<"channels">;
  parent?: Id<"messages">;
  conversation?: Id<"conversations">;
}

const INITIAL_SIZE = 10;

export const useGetMessages = ({
  channel,
  conversation,
  parent,
}: GetWorkspaceProps) => {
  const { results, loadMore, status } = usePaginatedQuery(
    api.messages.get,
    { channel, conversation, parent },
    { initialNumItems: INITIAL_SIZE }
  );

  const isLoading = status === "LoadingMore" || status === "LoadingFirstPage";
  const isEmpty = !results || results.length === 0;

  return {
    messages: results ?? [],
    loadMore,
    isLoading,
    isEmpty,
    status, // optional if you want to use it outside
  };
};
