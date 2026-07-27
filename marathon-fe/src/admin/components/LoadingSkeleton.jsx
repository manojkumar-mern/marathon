function LoadingSkeleton({ rows = 3, cols = 4, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 flex-1 animate-pulse rounded bg-steel" />
          ))}
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
