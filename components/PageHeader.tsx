import { useRouter } from "next/navigation";
import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  backLabel?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backLabel = "Back",
}) => {
  const router = useRouter();
  return (
    <div className="flex items-center space-x-4 mb-6">
      <button
        type="button"
        className="btn btn-ghost flex items-center"
        onClick={() => router.back()}
      >
        <span className="mr-2">←</span>
        {backLabel}
      </button>
      <div>
        <h1 className="text-3xl font-bold text-[#444444]">{title}</h1>
        {description && (
          <p className="text-[#ababab]">{description}</p>
        )}
      </div>
    </div>
  );
};
