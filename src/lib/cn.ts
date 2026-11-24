import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/*
 * tailwind-merge only knows Tailwind's default theme. Custom font-size names
 * must be registered, otherwise `text-display` is read as a color and dropped
 * when merged with `text-fg`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display"],
    },
  },
})

/** Joins conditional class names and resolves Tailwind conflicts (last wins). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
