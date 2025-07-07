import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f && !f.name.endsWith(".xlsx")) {
      toast({
        title: "Invalid file type",
        description: "Only .xlsx files are allowed",
        variant: "destructive",
      });
      setFile(null);
      return;
    }
    setFile(f);
  };

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
      toast({ title: "Success", description: "Bulk upload successful" });
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg-center"
      title={title}
    >
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <a
          href={sampleUrl}
          download
          className="mb-4"
        >
          <Button variant="outline">Download Sample XLSX</Button>
        </a>
        <div>
          <label className="block mb-2 font-medium">{label}</label>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white"
          />
        </div>
        <Button
          className="mt-4 btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Submit"}
        </Button>
      </div>
    </Modal>
  );
}

export default BulkUploadModal;
