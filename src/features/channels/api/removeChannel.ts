import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

interface mutateOptions {
  onSuccess?: (Response:boolean) => void;
  onError?: (error:Error) => void;
  onSetteled?: () => void;
  throwError?:boolean;
}

interface mutateValues {
  id:Id<'channels'>;
}

type stateTypes = "pending" | "success" | "error" | "setteled" | "";

export const useRemoveChannel = () => {
  const mutation = useMutation(api.channels.remove);

  const [Data, setData] = useState<boolean | null>(null)
  const [state, setState] = useState<stateTypes>("");

  const IsPending = useMemo(() => state == 'pending',[state])
  const IsSuccess = useMemo(() => state == 'success',[state])
  const IsError = useMemo(() => state == 'error',[state])
  const IsSetteled = useMemo(() => state == 'setteled',[state])


  const mutate = useCallback(
    async (values: mutateValues, options?: mutateOptions) => {
      try {
        setData(null)
        setState('pending')
        const { id } = values;
        const Response = await mutation({ id });
        setData(Response)
        setState('success')
        options?.onSuccess?.(Response)
        return Response
      } catch (e) {
        setState('error')
        if(options?.throwError) {
            options?.onError?.(e as Error)
        }
      } finally {
        setState('setteled')
        options?.onSetteled?.()
      }
    },
    [mutation]
  );

  return { state, mutate, Data, IsPending, IsError, IsSuccess, IsSetteled };
};
