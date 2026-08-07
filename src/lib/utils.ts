import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHours(hours: number) {
  return `${hours} contact hour${hours === 1 ? "" : "s"}`;
}

export function percent(n: number) {
  return `${Math.round(n)}%`;
}
