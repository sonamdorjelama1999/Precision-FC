import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Turns a title into a URL segment: "El Clasico: 3-1!" -> "el-clasico-3-1".
 * Used to default a NewsPost's slug from its title — the admin can still
 * edit the result, this just saves typing one in by hand every time.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents NFKD split off (e.g. e + combining acute)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
