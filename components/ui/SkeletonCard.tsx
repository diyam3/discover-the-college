export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-slate-200 rounded-full" />
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
        </div>
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
        <div className="h-3 w-1/2 bg-slate-200 rounded" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
        </div>
        <div className="h-2 bg-slate-200 rounded-full" />
        <div className="h-8 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 animate-pulse">
      <div className="w-32 h-24 bg-slate-200 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 w-2/3 bg-slate-200 rounded" />
        <div className="h-3 w-1/3 bg-slate-200 rounded" />
        <div className="flex gap-2 mt-2">
          <div className="h-5 w-16 bg-slate-100 rounded-full" />
          <div className="h-5 w-20 bg-slate-100 rounded-full" />
        </div>
        <div className="h-3 w-full bg-slate-100 rounded" />
      </div>
    </div>
  );
}
