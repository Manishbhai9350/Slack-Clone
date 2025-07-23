import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

interface mutateOptions {
  onSuccess?: (Response:Id<'messages'>) => void;
  onError?: (error:Error) => void;
  onSettled?: () => void;
  throwError?:boolean;
}

interface mutateValues {
  message:Id<'messages'>;
  value:string;
}

type stateTypes = "pending" | "success" | "error" | "settled" | "";

export const useUpdateMessage = () => {
  const mutation = useMutation(api.messages.update);

  const [Data, setData] = useState<Id<'messages'> | null>(null)
  const [state, setState] = useState<stateTypes>("");

  const IsPending = useMemo(() => state === 'pending',[state])
  const IsSuccess = useMemo(() => state === 'success',[state])
  const IsError = useMemo(() => state === 'error',[state])
  const IsSettled = useMemo(() => state === 'settled',[state])


  const mutate = useCallback(
    async (values: mutateValues, options?: mutateOptions) => {
      try {
        setData(null)
        setState('pending')
        const Response = await mutation(values);
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
        setState('settled')
        options?.onSettled?.()
      }
    },
    [mutation]
  );

  return { state, mutate, Data, IsPending, IsError, IsSuccess, IsSettled };
};
