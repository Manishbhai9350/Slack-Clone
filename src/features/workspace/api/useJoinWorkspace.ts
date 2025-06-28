import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

interface Requestvalues {
  joinCode: string;
  workspaceId: Id<"workspaces">;
}
interface OptionsMethods {
  onSuccess?: (Response: Id<"workspaces">) => void;
  onError?: (error: Error) => void;
  onSetteled?: () => void;
  throwError?: boolean;
}

type stateTypes = "pending" | "success" | "error" | "setteled" | "";

export const useJoinWorkspace = () => {
  const mutation = useMutation(api.workspaces.join);

  const [Data, setData] = useState<Id<"workspaces"> | null>(null);
  const [state, setState] = useState<stateTypes>("");

  const IsPending = useMemo(() => state == "pending", [state]);
  const IsSuccess = useMemo(() => state == "success", [state]);
  const IsError = useMemo(() => state == "error", [state]);
  const IsSetteled = useMemo(() => state == "setteled", [state]);

  const mutate = useCallback(
    async (values: Requestvalues, options: OptionsMethods) => {
      try {
        setData(null);
        setState("pending");
        const Response = await mutation(values);
        setData(Response);
        setState("success");
        options?.onSuccess?.(Response);
        return Response;
      } catch (e) {
        setState("error");
        if (options?.throwError) {
          options?.onError?.(e as Error);
        }
      } finally {
        setState("setteled");
        options?.onSetteled?.();
      }
    },
    [mutation]
  );
  return { state, mutate, Data, IsPending, IsError, IsSuccess, IsSetteled };
};
