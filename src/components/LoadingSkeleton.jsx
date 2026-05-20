export default function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-5 bg-muted rounded w-1/3" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-4/5" />
      <div className="h-4 bg-muted rounded w-2/3" />
      <div className="mt-4 space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-3 bg-muted rounded w-1/4" style={{ opacity: 1 - i * 0.1 }} />
            <div className="h-3 bg-muted/60 rounded w-1/2" style={{ opacity: 1 - i * 0.1 }} />
          </div>
        ))}
      </div>
    </div>
  );
}