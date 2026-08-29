import { cn } from "@/lib/utils";

/** The site's single content column: max 1160px, 24px gutters (18px on phones). */
export function Wrap({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1160px] px-[18px] sm:px-6", className)}>
      {children}
    </div>
  );
}
