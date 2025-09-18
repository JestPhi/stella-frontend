# Mutation Factory Pattern

## Overview

The `useMutationFactory` provides a standardized way to create React Query mutation hooks, eliminating boilerplate code and ensuring consistent error handling and cache invalidation patterns.

## Benefits

- **Reduced Boilerplate**: ~70% reduction in mutation hook code
- **Consistent Error Handling**: Standardized error logging with context
- **Type Safety**: Full TypeScript support with proper inference
- **Cache Management**: Simplified query invalidation and removal
- **Maintainability**: Single source of truth for mutation patterns

## Usage

### Basic Example

```typescript
import { createMutation, createQueryKeys } from "./useMutationFactory";

export const useStoryCreate = createMutation({
  mutationFn: ({ stellaId, storyData, storyId }) =>
    storiesAPI.create(stellaId, storyData, storyId),
  invalidateQueries: (variables) => [
    createQueryKeys.story(variables.stellaId).all,
    createQueryKeys.story(variables.stellaId).byUser,
  ],
  errorMessage: "creating story",
});
```

### Advanced Example with Query Removal

```typescript
export const useStoryDelete = createMutation({
  mutationFn: ({ stellaId, storyId }) => storiesAPI.delete(stellaId, storyId),
  invalidateQueries: (variables) => [
    createQueryKeys.story(variables.stellaId).all,
    createQueryKeys.story(variables.stellaId).byUser,
  ],
  removeQueries: (variables) => [
    createQueryKeys.story(variables.stellaId, variables.storyId).detail!,
  ],
  errorMessage: "deleting story",
});
```

## Configuration Options

### `mutationFn` (required)

The async function that performs the mutation.

### `invalidateQueries` (optional)

Function that returns an array of query keys to invalidate after successful mutation.

### `removeQueries` (optional)

Function that returns an array of query keys to remove from cache after successful mutation.

### `errorMessage` (optional)

Human-readable description of the operation for error logging.

### `onSuccessCallback` (optional)

Additional success handling logic.

### `enableToast` (optional)

Future: Enable success/error toast notifications.

## Query Key Helpers

The `createQueryKeys` object provides standardized query key generation:

```typescript
// Story keys
createQueryKeys.story(stellaId).all; // ["stories"]
createQueryKeys.story(stellaId).byUser; // ["userStories", stellaId]
createQueryKeys.story(stellaId, storyId).detail; // ["story", stellaId, storyId]

// Profile keys
createQueryKeys.profile(stellaId).detail; // ["profile", stellaId]
```

## Error Handling

The factory provides structured error logging with context:

```typescript
{
  error: Error,
  context: {
    operation: "creating story",
    variables: { stellaId, storyData, storyId },
    timestamp: "2024-09-16T10:00:00.000Z"
  }
}
```

## Migration Guide

### Before (Old Pattern)

```typescript
export const useStoryCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stellaId, storyData, storyId }) =>
      storiesAPI.create(stellaId, storyData, storyId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({
        queryKey: ["userStories", variables.stellaId],
      });
    },
  });
};
```

### After (New Pattern)

```typescript
export const useStoryCreate = createMutation({
  mutationFn: ({ stellaId, storyData, storyId }) =>
    storiesAPI.create(stellaId, storyData, storyId),
  invalidateQueries: (variables) => [
    createQueryKeys.story(variables.stellaId).all,
    createQueryKeys.story(variables.stellaId).byUser,
  ],
  errorMessage: "creating story",
});
```

## Future Enhancements

1. **Toast Notifications**: Automatic success/error notifications
2. **Retry Logic**: Configurable retry strategies
3. **Optimistic Updates**: Built-in optimistic update patterns
4. **Analytics**: Automatic mutation performance tracking
5. **Loading States**: Unified loading state management

## Best Practices

1. Always provide descriptive `errorMessage`
2. Use `createQueryKeys` for consistent cache keys
3. Prefer `invalidateQueries` over `removeQueries` unless removing specific items
4. Keep mutation functions pure and focused
5. Test both success and error scenarios
