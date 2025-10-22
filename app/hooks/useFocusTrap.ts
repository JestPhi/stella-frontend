import { useEffect, useRef } from "react";

/**
 * Hook to trap focus within a container element
 * Useful for modals, dialogs, and other overlay components
 *
 * @param isActive - Whether the focus trap should be active
 * @returns A ref to attach to the container element
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  isActive: boolean = true
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    // Get all focusable elements
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        "a[href]",
        "button:not([disabled])",
        "textarea:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(", ");

      return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter((element) => {
        // Filter out hidden elements
        return element.offsetParent !== null;
      });
    };

    // Store the previously focused element
    const previouslyFocusedElement = document.activeElement as HTMLElement;

    // Focus the first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Handle tab key to trap focus
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab (backward)
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
      // Tab (forward)
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    // Cleanup: restore focus to previously focused element
    return () => {
      container.removeEventListener("keydown", handleKeyDown);

      // Restore focus when component unmounts
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}
