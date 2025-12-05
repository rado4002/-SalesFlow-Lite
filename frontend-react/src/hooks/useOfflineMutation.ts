// src/hooks/useOfflineMutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { enqueueSyncOp } from "../offline/syncQueue";

export function useOfflineMutation<TVariables, TData = unknown>(
  mutationFn: (vars: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, Error, TVariables>
) {
  const { isOnline } = useAuth();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (vars: TVariables) => {
      if (isOnline) return mutationFn(vars);

      const path = (options?.mutationKey?.[0] as string) ?? "";
      await enqueueSyncOp({
        method: "POST",
        path,
        body: vars as any,
      });
      return {} as TData;
    },
    ...options,
  });
}