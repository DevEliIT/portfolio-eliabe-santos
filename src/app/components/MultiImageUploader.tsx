"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload, Sparkles, RefreshCw } from "lucide-react";

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export function MultiImageUploader({ value = [], onChange, label = "Galeria de Imagens do Projeto" }: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper Canvas Image Compression
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível processar o canvas"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Falha na compressão"));
          },
          "image/webp",
          0.8
        );
      };

      img.onerror = () => reject(new Error("Erro ao carregar imagem"));
      reader.readAsDataURL(file);
    });
  };

  const handleFilesChange = async (filesList: FileList) => {
    const files = Array.from(filesList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;

    setUploading(true);
    setUploadCount({ current: 0, total: files.length });

    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setUploadCount({ current: i + 1, total: files.length });
      const file = files[i];

      try {
        const compressedBlob = await compressImage(file);
        const formData = new FormData();
        const compressedFile = new File(
          [compressedBlob],
          file.name.replace(/\.[^/.]+$/, "") + ".webp",
          { type: "image/webp" }
        );

        formData.append("file", compressedFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          newUrls.push(data.url);
        }
      } catch (err) {
        console.error("Erro ao subir imagem da galeria:", err);
      }
    }

    if (newUrls.length > 0) {
      onChange([...value, ...newUrls]);
    }

    setUploading(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = value.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase text-white/70">
          {label} ({value.length})
        </label>
        <span className="text-[10px] text-white/40 font-mono">
          Compressão automática em WebP leve
        </span>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {value.map((url, idx) => (
          <div
            key={idx}
            className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group bg-black/40 shadow"
          >
            <Image src={url} alt={`Galeria ${idx + 1}`} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                title="Remover imagem"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-white/70 bg-black/50 px-1.5 py-0.5 rounded">
              #{idx + 1}
            </span>
          </div>
        ))}

        {/* Add Images Button Box */}
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="aspect-video rounded-xl border-2 border-dashed border-white/20 hover:border-[#e84040]/80 bg-[#161927] hover:bg-white/[0.02] flex flex-col items-center justify-center cursor-pointer transition-all text-center p-3 group"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-1.5 text-xs text-white/70">
              <RefreshCw size={20} className="animate-spin text-[#e84040]" />
              <span>Enviando {uploadCount.current}/{uploadCount.total}...</span>
            </div>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#e84040]/10 flex items-center justify-center mb-1 text-white/60 group-hover:text-[#e84040] transition-colors">
                <Plus size={18} />
              </div>
              <span className="text-xs font-semibold text-white/80">Adicionar Fotos</span>
              <span className="text-[9px] text-white/40 mt-0.5">Selecione uma ou mais</span>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFilesChange(e.target.files);
          }
        }}
      />
    </div>
  );
}
