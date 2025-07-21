import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const colors = [
  "bg-amber-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-indigo-500",
  "bg-rose-600",
];

export function GetProfileBackground(name:string){
  const firstLetter = name.charAt(0).toUpperCase();
  const charCode = firstLetter.charCodeAt(0); // e.g., A = 65, Z = 90
  const colorIndex = charCode % colors.length;
  return colors[colorIndex];
}