import { useMemo } from "react";
import { z } from "zod";
import { CoverPageData } from "../types/story";

/**
 * Zod schema for validating page panel data
 */
const pagePanelSchema = z.object({
  "0": z
    .object({
      grid: z.object({
        c: z.number(),
        r: z.number(),
        rs: z.number(),
        cs: z.number(),
      }),
      type: z.literal("jpg"),
      value: z.string().optional(),
      file: z.any().optional(),
    })
    .refine((data) => data.value || data.file, {
      message: "Image is required - please upload or select an image",
    }),
  "1": z
    .object({
      grid: z.object({
        c: z.number(),
        r: z.number(),
        rs: z.number(),
        cs: z.number(),
      }),
      type: z.literal("text"),
      placeholder: z.string(),
      value: z.string(),
    })
    .refine((data) => data.value?.trim().length > 0, {
      message: "Text is required - please enter a title",
    })
    .refine((data) => data.value?.trim().length <= 240, {
      message: "Text must be 240 characters or less",
    }),
});

/**
 * Custom hook for validating page data (cover pages and regular pages)
 * Ensures both text and image content are present before allowing save
 */
export const usePageValidation = (pageData: CoverPageData) => {
  const validation = useMemo(() => {
    const result = pagePanelSchema.safeParse(pageData);

    if (result.success) {
      return {
        hasText: true,
        hasImage: true,
        isValid: true,
        errors: [],
      };
    }

    // Extract specific validation errors
    const errors = result.error.issues.map((err: any) => err.message);
    const hasText = !errors.some((msg: string) =>
      msg.includes("Text is required")
    );
    const hasImage = !errors.some((msg: string) =>
      msg.includes("Image is required")
    );

    return {
      hasText,
      hasImage,
      isValid: false,
      errors,
    };
  }, [pageData]);

  return validation;
};
