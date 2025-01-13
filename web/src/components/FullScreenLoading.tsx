"use client";

import { cn } from "@/lib/utils";

export function FullScreenLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-0 flex min-h-screen flex-col items-center justify-center bg-background",
        className
      )}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="h-16 w-16 animate-bounce">
          {/* Simple logo placeholder - replace with your app logo */}
          <div className="h-full w-full rounded-full bg-primary/20 p-4">
            <div className="h-full w-full rounded-full bg-primary animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-4 w-48 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-32 animate-pulse rounded-full bg-muted/60" />
        </div>
      </div>
    </div>
  );
}
