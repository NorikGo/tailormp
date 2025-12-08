'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { uploadImage, deleteImage, validateImage } from '@/app/lib/upload';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  bucket: 'products' | 'portfolios' | 'avatars';
  folder?: string;
  currentImages?: string[];
  maxImages?: number;
  onUploadComplete: (urls: string[]) => void;
  onDelete?: (url: string) => void;
}

export default function ImageUpload({
  bucket,
  folder,
  currentImages = [],
  maxImages = 5,
  onUploadComplete,
  onDelete,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(currentImages);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Check max images
    if (images.length + files.length > maxImages) {
      toast({
        title: 'Zu viele Bilder',
        description: `Maximal ${maxImages} Bilder erlaubt.`,
        variant: 'destructive',
      });
      return;
    }

    // Validate all files first
    for (const file of files) {
      const error = validateImage(file);
      if (error) {
        toast({
          title: 'Ungültige Datei',
          description: error,
          variant: 'destructive',
        });
        return;
      }
    }

    setUploading(true);

    try {
      const uploadPromises = files.map((file) => uploadImage(file, bucket, folder));
      const results = await Promise.all(uploadPromises);

      const successfulUploads: string[] = [];
      const errors: string[] = [];

      results.forEach((result) => {
        if ('error' in result) {
          errors.push(result.error);
        } else {
          successfulUploads.push(result.url);
        }
      });

      if (successfulUploads.length > 0) {
        const newImages = [...images, ...successfulUploads];
        setImages(newImages);
        onUploadComplete(newImages);

        toast({
          title: 'Upload erfolgreich',
          description: `${successfulUploads.length} Bild(er) hochgeladen.`,
        });
      }

      if (errors.length > 0) {
        toast({
          title: 'Einige Uploads fehlgeschlagen',
          description: errors[0],
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Upload fehlgeschlagen',
        description: 'Ein Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (url: string) => {
    const newImages = images.filter((img) => img !== url);
    setImages(newImages);
    onUploadComplete(newImages);

    if (onDelete) {
      onDelete(url);
    }

    toast({
      title: 'Bild entfernt',
      description: 'Das Bild wurde entfernt.',
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {images.length < maxImages && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full sm:w-auto"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Hochladen...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Bilder hochladen ({images.length}/{maxImages})
              </>
            )}
          </Button>
          <p className="text-sm text-slate-500 mt-2">
            Max. {maxImages} Bilder, je max. 5MB (JPG, PNG, WebP)
          </p>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg border bg-slate-100 overflow-hidden group"
            >
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(url)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Hauptbild
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 mb-2">Noch keine Bilder hochgeladen</p>
          <p className="text-sm text-slate-500">
            Klicke auf "Bilder hochladen" um zu starten
          </p>
        </div>
      )}
    </div>
  );
}
