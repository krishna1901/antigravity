import { Skeleton, SkeletonCard, LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";

type Variant = "stats" | "table" | "grid" | "split" | "detail" | "board";

/**
 * Route-level loading skeleton. Rendered by each segment's `loading.tsx`
 * inside the app shell's padded content area, so it inherits page padding +
 * the page-entrance animation. Pick the variant matching the page's layout.
 */
export function PageSkeleton({ variant = "stats", className }: { variant?: Variant; className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>

      {variant === "stats" && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Skeleton className="h-72 rounded-2xl lg:col-span-2" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        </>
      )}

      {variant === "table" && (
        <>
          <Skeleton className="h-14 rounded-2xl" />
          <div className="rounded-2xl border border-border bg-card p-4">
            <LoadingSkeleton rows={7} />
          </div>
        </>
      )}

      {variant === "grid" && (
        <>
          <Skeleton className="h-14 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        </>
      )}

      {variant === "split" && (
        <div className="grid gap-4 lg:grid-cols-12">
          <Skeleton className="h-[60vh] rounded-2xl lg:col-span-5 xl:col-span-4" />
          <Skeleton className="h-[60vh] rounded-2xl lg:col-span-7 xl:col-span-8" />
        </div>
      )}

      {variant === "detail" && (
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
          <div className="space-y-4 lg:col-span-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      {variant === "board" && (
        <>
          <Skeleton className="h-14 rounded-2xl" />
          <Skeleton className="h-[600px] rounded-2xl" />
        </>
      )}
    </div>
  );
}
