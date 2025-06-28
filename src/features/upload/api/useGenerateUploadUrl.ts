import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";

interface mutateOptions {
  onSuccess?: (Response:string) => void;
  onError?: (error:Error) => void;
  onSetteled?: () => void;
  throwError?:boolean;
}

type stateTypes = "pending" | "success" | "error" | "setteled" | "";

export const useGenerateUploadUrl = () => {
  const mutation = useMutation(api.upload.GenerateUploadUrl);

  const [Data, setData] = useState<string | null>(null)
  const [state, setState] = useState<stateTypes>("");

  const IsPending = useMemo(() => state == 'pending',[state])
  const IsSuccess = useMemo(() => state == 'success',[state])
  const IsError = useMemo(() => state == 'error',[state])
  const IsSetteled = useMemo(() => state == 'setteled',[state])


  const mutate = useCallback(
    async (values: null, options?: mutateOptions) => {
      try {
        setData(null)
        setState('pending')
        const Response = await mutation();
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
