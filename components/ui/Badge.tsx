import { cn } from "@/lib/utils";
import type { BadgeVariant } from "@/types/college";

const variants: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-600 border-transparent",
  blue:    "bg-blue-50 text-blue-700 border-blue-100",
  green:   "bg-emerald-50 text-emerald-700 border-emerald-100",
  amber:   "bg-amber-50 text-amber-700 border-amber-100",
  red:     "bg-red-50 text-red-700 border-red-100",
  violet:  "bg-violet-50 text-violet-700 border-violet-100",
  gold:    "bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-transparent font-semibold",
  outline: "bg-transparent text-slate-600 border-slate-200",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border", variants[variant], className)}>
      {children}
    </span>
  );
}

export function ChanceBadge({ chance }: { chance: number }) {
  if (chance >= 75) return <Badge variant="green">{chance}% · Safe</Badge>;
  if (chance >= 45) return <Badge variant="amber">{chance}% · Target</Badge>;
  return <Badge variant="red">{chance}% · Dream</Badge>;
}
