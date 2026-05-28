import { cn } from "@/lib/utils";

interface PageLoaderProps {
  fullPage?: boolean;
  text?: string;
  className?: string;
}

const PageLoader = ({
  fullPage = false,
  text = "Carregando...",
  className,
}: PageLoaderProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 text-gray-400",
      fullPage ? "min-h-screen bg-background" : "min-h-[400px]",
      className,
    )}
  >
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
    {text && <span className="text-sm font-medium">{text}</span>}
  </div>
);

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn("bg-gray-100 rounded-xl animate-pulse", className)} />
);

const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
    <div className="flex items-center justify-between pt-2">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-9 w-24 rounded-xl" />
    </div>
  </div>
);

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
);

export { PageLoader, Skeleton, CardSkeleton, StatsSkeleton };
