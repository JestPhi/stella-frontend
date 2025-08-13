# Create Story Button Documentation

## Overview

The "Add Story" button is the primary action button in the story creation interface that handles the complete process of creating and saving a new story with uploaded content.

## Button Behavior

### Default State

- **Label**: "Add Story"
- **Variant**: Primary button styling
- **Action**: Triggers the story creation and save process

### Loading State

- **Label**: "Saving..."
- **Behavior**: Button becomes disabled during the save operation
- **Purpose**: Provides user feedback that the operation is in progress

## Functionality

### What happens when clicked:

1. **Data Collection**

   - Collects all panel data from the current story editor state
   - Includes text content and uploaded images
   - Uses `dataRef.current` to access the latest form data

2. **File Upload Process**

   - Identifies any uploaded image files in the story data
   - Uploads each image file to the storage service
   - Generates unique image keys for each uploaded file
   - Updates the story data with the uploaded image references

3. **Story Creation**

   - Generates a unique story ID using `uuidv4()`
   - Creates the story record in the database with all content
   - Associates the story with the specified user (stellaId)

4. **Success Navigation**

   - On successful creation, sends a message to the parent window
   - Navigates to the newly created story's profile page
   - Closes any modal dialogs
   - Uses the pattern: `/profile/{stellaId}/story/{storyId}`

5. **Error Handling**
   - Displays error message if the save operation fails
   - Allows user to retry the operation
   - Maintains all entered data for retry attempts

## Technical Implementation

### Dependencies

- **TanStack Query**: Handles the mutation for async operations
- **Story API**: Backend service for story creation and file uploads
- **UUID**: Generates unique identifiers for stories
- **File Upload Utilities**: Processes and uploads image files

### Data Flow

```
User Input → Panel Data → File Uploads → Story Creation → Navigation
```

### Error States

- Network failures during upload
- Server errors during story creation
- File upload failures
- Invalid data validation errors

## User Experience

### Success Flow

1. User fills out story content (text, images)
2. User clicks "Add Story" button
3. Button shows "Saving..." state
4. Story is created and saved
5. User is redirected to the new story page

### Error Flow

1. User clicks "Add Story" button
2. Button shows "Saving..." state
3. Error occurs during save process
4. Error message displays: "Failed to save story. Please try again."
5. Button returns to "Add Story" state for retry

## Integration Points

### Parent Communication

- Communicates with parent React Native app via `postMessage`
- Updates the app's routing and modal state
- Handles cross-platform navigation

### Storage Integration

- Uploads files to configured storage service
- Manages file references and keys
- Handles image processing and optimization

## Configuration

### Environment Variables

- `NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST`: Target for parent communication

### Initial Page State

The button operates on a story template with:

- Image upload area (12 columns, 10 rows)
- Title text field (12 columns, 2 rows, placeholder: "Enter a title")
