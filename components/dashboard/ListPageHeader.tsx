"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload } from "lucide-react";
import React from "react";

interface ListPageHeaderProps {
  title: string;
  description?: string;
  showAddButton?: boolean;
  onAdd?: () => void;
  addLabel?: string;
  showBulkAddButton?: boolean;
  onBulkAdd?: () => void;
  bulkAddLabel?: string;
  children?: React.ReactNode;
}

export default function ListPageHeader({
  title,
  description,
  showAddButton = false,
  onAdd,
  addLabel = "Add",
  showBulkAddButton = false,
  onBulkAdd,
  bulkAddLabel = "Bulk Add",
  children,
}: ListPageHeaderProps) {
  return (
    <Card className="mb-4 no-card">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl font-bold text-[#444444]">{title}</CardTitle>
          {description && (
            <CardDescription className="text-[#ababab]">{description}</CardDescription>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showBulkAddButton && (
            <Button variant="secondary" className="border-2" onClick={onBulkAdd}>
              <Upload className="mr-2 h-4 w-4" />
              {bulkAddLabel}
            </Button>
          )}
          {showAddButton && (
            <Button variant="default" className="btn-primary" onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              {addLabel}
            </Button>
          )}
          {children}
        </div>
      </CardHeader>
    </Card>
  );
}
