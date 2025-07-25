import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Converts bytes to a human-readable string (KB, MB, GB)
 export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}


export const generateUUID = () => crypto.randomUUID()


export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}