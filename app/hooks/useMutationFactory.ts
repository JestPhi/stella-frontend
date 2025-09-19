import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

/**
 * Type for defining query keys to invalidate after a successful mutation
 */
type QueryKeyGenerator<TVariables> = (
  variables: TVariables,
  data?: any
) => (string[] | string)[];

/**
 * Type for defining query keys to remove after a successful mutation
 */
type QueryKeyRemover<TVariables> = (
  variables: TVariables,
  data?: any
) => (string[] | string)[];

/**
 * Configuration for the mutation factory
 */
interface MutationConfig<TVariables, TData> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  invalidateQueries?: QueryKeyGenerator<TVariables>;
  removeQueries?: QueryKeyRemover<TVariables>;
  errorMessage?: string;
  onSuccessCallback?: (data: TData, variables: TVariables) => void;
  enableToast?: boolean; // Future: for showing success/error toasts
}

/**
 * Generic mutation factory to eliminate boilerplate in mutation hooks
 *
 * @param config Configuration object containing mutation function and query management
 * @returns A hook that returns a configured useMutation
 *
 * @example
 * ```typescript
 * export const useStoryCreate = createMutation({
 *   mutationFn: ({ stellaId, storyData, storyId }) =>
 *     storiesAPI.create(stellaId, storyData, storyId),
 *   invalidateQueries: (variables) => [
 *     ["stories"],
 *     ["userStories", variables.stellaId]
 *   ],
 *   errorMessage: "creating story"
 * });
 * ```
 */
export function createMutation<TVariables, TData>(
  config: MutationConfig<TVariables, TData>
) {
  return (
    options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: config.mutationFn,
      onSuccess: (data, variables) => {
        // Invalidate specified queries
        if (config.invalidateQueries) {
          const queryKeys = config.invalidateQueries(variables, data);
          queryKeys.forEach((key) => {
            queryClient.invalidateQueries({
              queryKey: Array.isArray(key) ? key : [key],
            });
          });
        }

        // Remove specified queries
        if (config.removeQueries) {
          const queryKeys = config.removeQueries(variables, data);
          queryKeys.forEach((key) => {
            queryClient.removeQueries({
              queryKey: Array.isArray(key) ? key : [key],
            });
          });
        }

        // Call custom success callback if provided
        if (config.onSuccessCallback) {
          config.onSuccessCallback(data, variables);
        }

        // Call any additional onSuccess from options
        if (options?.onSuccess) {
          options.onSuccess(data, variables, undefined);
        }
      },
      onError: (error, variables, context) => {
        // Standardized error handling with structured logging
        const errorContext = {
          operation: config.errorMessage || "mutation",
          variables,
          timestamp: new Date().toISOString(),
        };

        console.error(`Error ${errorContext.operation}:`, {
          error,
          context: errorContext,
        });

        // Future: Add toast notifications here
        // if (config.enableToast) {
        //   showErrorToast(`Failed to ${config.errorMessage}`);
        // }

        // Call any additional onError from options
        if (options?.onError) {
          options.onError(error, variables, context);
        }
      },
      ...options,
    });
  };
}

/**
 * Helper function to create query keys for common patterns
 */
export const createQueryKeys = {
  /**
   * Creates query keys for story-related operations
   */
  story: (stellaId: string, storyId?: string) => ({
    all: ["stories"] as string[],
    byUser: ["userStories", stellaId] as string[],
    detail: storyId ? (["story", stellaId, storyId] as string[]) : undefined,
  }),

  /**
   * Creates query keys for profile-related operations
   */
  profile: (stellaId: string) => ({
    detail: ["profile", stellaId] as string[],
  }),
};
