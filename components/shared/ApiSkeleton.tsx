import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Skeleton wrapper component that handles conditional rendering between loading state and loaded content.
 */
export function SkeletonWrapper({
  isLoading,
  skeleton,
  children,
}: {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}) {
  if (isLoading) {
    return <>{skeleton}</>;
  }

  return <>{children}</>;
}

/**
 * Multi-line paragraph skeleton with realistic line widths.
 */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, index) => {
        const isLast = index === lines - 1;
        const widthClass = isLast
          ? "w-3/5"
          : index % 2 === 1
            ? "w-4/5"
            : "w-full";
        return <Skeleton key={index} className={cn("h-4", widthClass)} />;
      })}
    </div>
  );
}

/**
 * Card skeleton for media items (videos, songs, albums, playlists).
 */
export function SkeletonCard({
  count = 1,
  aspectRatio = "aspect-video",
  className,
}: {
  count?: number;
  aspectRatio?: "aspect-video" | "aspect-square" | "aspect-4/3";
  className?: string;
}) {
  const items = Array.from({ length: count });

  const renderSingleCard = (key: number) => (
    <div
      key={key}
      className={cn(
        "flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-xs dark:bg-slate-900",
        className,
      )}
    >
      <Skeleton className={cn("w-full rounded-xl", aspectRatio)} />
      <div className="flex gap-2.5 pt-1">
        <Skeleton className="size-9 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>
    </div>
  );

  if (count === 1) {
    return renderSingleCard(0);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((_, index) => renderSingleCard(index))}
    </div>
  );
}

/**
 * Row/List item skeleton for rankings, track lists, search results, or playlists.
 */
export function SkeletonListItem({
  count = 5,
  showRank = true,
  className,
}: {
  count?: number;
  showRank?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex h-12 items-center gap-3 rounded-lg px-2"
        >
          {showRank && <Skeleton className="h-4 w-6 shrink-0 rounded" />}
          <Skeleton className="size-10 shrink-0 rounded-lg" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="size-8 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/**
 * Banner skeleton for hero banners or promotional carousels.
 */
export function SkeletonBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "aspect-33/7 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800",
        className,
      )}
    >
      <Skeleton className="size-full rounded-2xl" />
    </div>
  );
}

/**
 * Complete music chart dashboard skeleton matching the 3-column layout.
 */
export function SkeletonMusicDashboard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid items-stretch gap-4 lg:grid-cols-[minmax(220px,1fr)_minmax(400px,1.6fr)_minmax(220px,1fr)]",
        className,
      )}
    >
      {[0, 1, 2].map((colIndex) => (
        <div
          key={colIndex}
          className="flex h-160 min-w-0 flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:h-168 lg:h-[calc(100dvh-15rem)] lg:max-h-168 lg:min-h-128 dark:bg-slate-900"
        >
          <div className="mb-3 flex items-center justify-between px-2 pt-1">
            <Skeleton className="h-6 w-32" />
            {colIndex === 1 && <Skeleton className="h-6 w-24 rounded-full" />}
          </div>
          <div className="grid min-h-0 flex-1 grid-rows-10 gap-1 overflow-hidden">
            {Array.from({ length: 10 }).map((_, itemIndex) => (
              <div
                key={itemIndex}
                className="grid h-full min-h-0 w-full grid-cols-[1.5rem_2.5rem_1fr] items-center gap-2 px-2 sm:grid-cols-[1.75rem_2.5rem_1fr]"
              >
                <Skeleton className="h-4 w-4" />
                <Skeleton className="size-9 rounded-lg" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Table/Admin list rows skeleton.
 */
export function SkeletonTable({
  rows = 4,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Re-export base Skeleton for single import convenience
export { Skeleton } from "@/components/ui/skeleton";
