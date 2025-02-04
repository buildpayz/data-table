import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to conditionally merge Tailwind CSS classes.
 * It uses `clsx` to handle conditional classes and `twMerge` to
 * remove conflicting Tailwind classes.
 *
 * @param inputs - CSS class names or conditionally applied class objects
 * @returns A merged string of valid Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
