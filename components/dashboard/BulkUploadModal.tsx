"use client";

import React, { useState, useCallback } from "react";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FileIcon, UploadIcon, DownloadIcon, XIcon } from "lucide-react";

interface BulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  sampleUrl: string;
  apiUrl: string;
  onSuccess?: () => void;
  title: string;
  label: string;
}

export function BulkUploadModal({
  open,
  onClose,
  sampleUrl,
  apiUrl,
  onSuccess,
  title,
  label,
}: BulkUploadModalProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.name.endsWith(".xlsx")) {
      toast({
        title: "Invalid file type",
        description: "Only .xlsx files are allowed",
        variant: "destructive",
      });
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await apiClient.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Success",
        description: "Bulk upload successful",
        variant: "default"
      });

      setFile(null);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg-center"
      title={title}
      className="p-6"
    >
      <div className="flex flex-col space-y-6">
        {/* Download sample section */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Download a sample template to see the required format
          </div>
          <a
            href={sampleUrl}
            download
            className="inline-flex"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <DownloadIcon size={16} />
              <span>Sample Template</span>
            </Button>
          </a>
        </div>

        {/* Upload area */}
        <Card className="border-dashed">
          <CardContent className="p-6">
            <div
              className={cn(
                "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors",
                dragActive && "border-primary/50 bg-primary/5",
                file && "border-success/50 bg-success/5"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex w-full flex-col items-center space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                    <FileIcon className="h-8 w-8 text-success" />
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive hover:text-destructive"
                    onClick={removeFile}
                  >
                    <XIcon size={14} />
                    <span>Remove</span>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <UploadIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mt-4 flex flex-col items-center text-center">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Drag and drop your .xlsx file here, or click to browse
                    </p>
                  </div>
                  <Label
                    htmlFor="file-upload"
                    className="mt-4 cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Browse Files
                  </Label>
                </>
              )}

              <Input
                id="file-upload"
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="sr-only"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="gap-2"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadIcon size={16} />
                <span>Upload File</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default BulkUploadModal;
