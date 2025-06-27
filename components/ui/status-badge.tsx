import { Badge } from "./badge";

export interface StatusBadgeProps {
  status: 'approved' | 'update_requested' | 'confirmed' | 'fulfilled' | 'pending' | 'rejected';
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" = "secondary";
  let badgeClass = `font-xs status ${status} ${className}`;

  return (
    <Badge variant={variant} className={badgeClass.trim()}>
      {status?.replace(/_/g, " ")?.replace(/^\w/, (c) => c.toUpperCase())}
    </Badge>
  );
}
