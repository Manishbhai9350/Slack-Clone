import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface GetWorkspaceProps {
  channel?: Id<"channels">;
  parent?: Id<"messages"> | null;
  conversation?: Id<"conversations">;
}

const INITIAL_SIZE = 20;

export const useGetMessages = ({
  channel,
  conversation,
  parent,
}: GetWorkspaceProps) => {
  const { results, loadMore, status } = usePaginatedQuery(
    api.messages.get,
    {
      channel,
      conversation,
      parent: parent || undefined
    },
    { initialNumItems: INITIAL_SIZE }
  );

  const isLoading = status === "LoadingMore" || status === "LoadingFirstPage";
  const isEmpty = !results || results.length === 0;

  return {
    messages: results ?? [],
    loadMore: () => loadMore(INITIAL_SIZE),
    isLoading,
    isEmpty,
    status, // optional if you want to use it outside
  };
};
