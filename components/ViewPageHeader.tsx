import { Button } from "@/components/ui/button";
import { handleDelete } from "@/lib/handleDelete";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface ViewPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backLabel?: string;
  showEditButton?: boolean;
  editHref?: string;
  showDeleteButton?: boolean;
  deleteOptions?: {
    storeName: string;
    uuid: string;
    redirectPath?: string;
  };
}

export const ViewPageHeader: React.FC<ViewPageHeaderProps> = ({
  title,
  description,
  actions,
  backLabel = "Back",
  showEditButton = false,
  editHref,
  showDeleteButton = false,
  deleteOptions,
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">{title}</h1>
          {description && (
            <p className="text-[#ababab]">{description}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {showEditButton && editHref && (
          <Button variant="outline" onClick={() => router.push(editHref)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
        {showDeleteButton && deleteOptions && (
          <Button
            variant="destructive"
            onClick={() =>
              handleDelete({
                storeName: deleteOptions.storeName,
                uuid: deleteOptions.uuid,
                onSuccess: () => deleteOptions.redirectPath ? router.push(deleteOptions.redirectPath) : router.back(),
              })
            }
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
        {actions}
      </div>
    </div>
  );
};

export default ViewPageHeader;
