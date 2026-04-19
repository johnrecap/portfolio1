import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  className?: string;
};

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/60 bg-card/60 px-6 py-14 text-center shadow-sm",
        className,
      )}
    >
      <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h3>
      {description ? (
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

type SkeletonBlockProps = {
  count?: number;
  className?: string;
};

export function SkeletonBlocks({
  count = 3,
  className,
}: SkeletonBlockProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-3xl border border-border/50 bg-muted/50"
        />
      ))}
    </div>
  );
}
