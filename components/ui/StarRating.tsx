import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  totalRating?: number;
  size?: "xs" | "sm" | "md";
  className?: string;
}

export function StarRating({ rating, totalRating, size = "sm", className }: StarRatingProps) {
  const sizeClasses = { xs: "text-xs gap-0.5", sm: "text-sm gap-1", md: "text-base gap-1.5" };
  return (
    <div className={cn("flex items-center", sizeClasses[size], className)}>
      <span className="text-amber-400">★</span>
      <span className="font-bold text-slate-800">{rating.toFixed(1)}</span>
      {totalRating !== undefined && (
        <span className="text-slate-400 font-normal">({(totalRating / 1000).toFixed(1)}k)</span>
      )}
    </div>
  );
}
