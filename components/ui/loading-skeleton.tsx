interface LoadingSkeletonProps {
  title?: boolean;
  content?: boolean;
  className?: string;
}

export function LoadingSkeleton({ 
  title = true, 
  content = true, 
  className = "" 
}: LoadingSkeletonProps) {
  return (
    <div className={className}>
      <div className="animate-pulse">
        {title && (
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        )}
        {content && (
          <div className="h-64 bg-gray-200 rounded"></div>
        )}
      </div>
    </div>
  );
}
