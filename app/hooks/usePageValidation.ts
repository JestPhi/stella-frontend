import { useMemo } from "react";
import { CoverPageData } from "../types/story";

/**
 * Custom hook for validating page data (cover pages and regular pages)
 * Ensures both text and image content are present before allowing save
 */
export const usePageValidation = (pageData: CoverPageData) => {
  const validation = useMemo(() => {
    // Check if text content exists and is not empty
    const hasText = Boolean(pageData["1"]?.value?.toString().trim());

    // Check if image exists (either as uploaded file or existing value)
    const hasImage = Boolean(pageData["0"]?.value || pageData["0"]?.file);

    // Page is valid only if both text and image are present
    const isValid = hasText && hasImage;

    return {
      hasText,
      hasImage,
      isValid,
    };
  }, [pageData]);

  return validation;
};
