"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onUploadSuccess: (url: string, fileName: string) => void;
  onUploadError?: (error: string) => void;
  productId?: string;
  position?: number;
  maxSize?: number; // in MB
  className?: string;
}

export function ImageUpload({
  onUploadSuccess,
  onUploadError,
  productId,
  position = 0,
  maxSize = 5,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      // Client-side validation
      if (!file.type.startsWith("image/")) {
        throw new Error("Nur Bilddateien sind erlaubt");
      }

      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`Datei zu groß. Maximum ${maxSize}MB`);
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Prepare form data
      const formData = new FormData();
      formData.append("file", file);
      if (productId) formData.append("productId", productId);
      formData.append("position", position.toString());

      // Upload to API
      const response = await fetch("/api/upload/product-image", {
        method: "POST",
        headers: {
          "x-user-id": "dummy-tailor-id", // TODO: Replace with real auth
          "x-user-role": "tailor",
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload fehlgeschlagen");
      }

      const data = await response.json();
      onUploadSuccess(data.url, data.fileName);
    } catch (error: any) {
      const errorMessage = error.message || "Upload fehlgeschlagen";
      if (onUploadError) {
        onUploadError(errorMessage);
      }
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
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

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }, []);

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className={className}>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearPreview}
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </Button>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center
            transition-colors cursor-pointer
            ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 hover:border-slate-400"
            }
            ${uploading ? "opacity-50 pointer-events-none" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="w-12 h-12 text-slate-400 animate-spin mb-3" />
            ) : (
              <ImageIcon className="w-12 h-12 text-slate-400 mb-3" />
            )}
            <p className="text-sm font-medium text-slate-700 mb-1">
              {uploading ? "Wird hochgeladen..." : "Bild hochladen"}
            </p>
            <p className="text-xs text-slate-500">
              Drag & Drop oder klicken zum Auswählen
            </p>
            <p className="text-xs text-slate-400 mt-1">
              PNG, JPG, WebP bis {maxSize}MB
            </p>
          </label>
        </div>
      )}
    </div>
  );
}
