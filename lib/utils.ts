import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const BASE_PATH = process.env.NODE_ENV === "production" ? "/NiddhiSachdeo" : "";

export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const JOB_START = new Date(2021, 8); // Sept 2021

export function getExperienceYears(): number {
  const now = new Date();
  const diffMs = now.getTime() - JOB_START.getTime();
  return Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
}

export function getExperienceLabel(): string {
  return `${getExperienceYears()}+ Years Experience`;
}
