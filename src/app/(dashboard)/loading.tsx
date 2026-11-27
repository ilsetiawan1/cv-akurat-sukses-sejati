// src/app/(dashboard)/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-150 select-none font-sans">
      {/* ── Header Skeleton ── */}
      <div className="space-y-2">
        <div className="h-7 w-56 bg-slate-200/70 rounded-lg animate-pulse" />
        <div className="h-4 w-80 bg-slate-100 rounded-md animate-pulse" />
      </div>

      {/* ── Stat Cards Skeleton Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-slate-100 rounded-md animate-pulse" />
              <div className="w-8 h-8 rounded-xl bg-slate-100 animate-pulse" />
            </div>
            <div className="h-7 w-20 bg-slate-200/70 rounded-md animate-pulse" />
            <div className="h-3 w-32 bg-slate-100 rounded-md animate-pulse" />
          </div>
        ))}
      </div>

      {/* ── Main Content / Table Skeleton ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
        {/* Toolbar skeleton */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="h-10 w-full sm:w-64 bg-slate-100 rounded-xl animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-10 w-28 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-10 w-32 bg-slate-200/70 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Rows skeleton */}
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="h-12 w-full bg-slate-50/80 rounded-xl flex items-center justify-between px-4 animate-pulse border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-slate-200/70" />
                <div className="h-4 w-36 sm:w-56 bg-slate-200/60 rounded-md" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-16 bg-slate-200/60 rounded-md hidden sm:block" />
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
