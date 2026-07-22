"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Check, Image as ImageIcon, Sparkles, Link as LinkIcon } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onChange, label = "Imagem" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [compressEnabled, setCompressEnabled] = useState(true);
  const [stats, setStats] = useState<{ originalSize: string; compressedSize: string } | null>(null);
  const [useUrlMode, setUseUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to format bytes to KB / MB
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Canvas Image Compression logic with high quality (0.92) and 2000px limit
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 2000;
        const MAX_HEIGHT = 2000;
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

        // Convert canvas to WebP blob with 92% high quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Falha na compressão da imagem"));
            }
          },
          "image/webp",
          0.92
        );
      };

      img.onerror = () => reject(new Error("Erro ao carregar o arquivo de imagem"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    setUploading(true);
    setStats(null);

    try {
      const originalSizeFormatted = formatBytes(file.size);
      const formData = new FormData();

      if (compressEnabled) {
        // Compress image client-side to WebP with 92% quality
        const compressedBlob = await compressImage(file);
        const compressedSizeFormatted = formatBytes(compressedBlob.size);

        const compressedFile = new File(
          [compressedBlob],
          file.name.replace(/\.[^/.]+$/, "") + ".webp",
          { type: "image/webp" }
        );

        formData.append("file", compressedFile);
        setStats({
          originalSize: originalSizeFormatted,
          compressedSize: compressedSizeFormatted,
        });
      } else {
        // Send original file without any compression
        formData.append("file", file);
      }

      // Upload to local or Supabase via /api/upload
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
      } else {
        alert("Erro ao realizar upload no servidor.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value) {
      try {
        await fetch(`/api/upload?url=${encodeURIComponent(value)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Erro ao deletar imagem do servidor:", err);
      }
    }
    onChange("");
    setStats(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase text-white/70">
          {label} *
        </label>
        <button
          type="button"
          onClick={() => setUseUrlMode(!useUrlMode)}
          className="text-[10px] text-white/50 hover:text-white underline flex items-center gap-1"
        >
          {useUrlMode ? "Usar Upload Local / Supabase" : "Inserir URL externa"}
        </button>
      </div>

      {!useUrlMode && (
        <div className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            id={`compress-toggle-${label.replace(/\s+/g, "-")}`}
            checked={compressEnabled}
            onChange={(e) => setCompressEnabled(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-white/20 accent-[#e84040] cursor-pointer"
          />
          <label
            htmlFor={`compress-toggle-${label.replace(/\s+/g, "-")}`}
            className="text-[11px] text-white/75 cursor-pointer select-none font-medium flex items-center gap-1"
          >
            Otimizar e comprimir imagem para WebP (Alta Qualidade 92%)
          </label>
        </div>
      )}

      {useUrlMode ? (
        <div className="relative">
          <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="url"
            placeholder="https://exemplo.com/imagem.jpg"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#161927] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
          />
        </div>
      ) : (
        <div>
          {value ? (
            <div className="relative aspect-video max-h-48 rounded-xl overflow-hidden border border-white/10 group bg-black/40">
              <Image src={value} alt="Preview" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold uppercase px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 text-white"
                >
                  Trocar
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-xs font-bold uppercase px-3 py-1.5 rounded bg-red-500/80 hover:bg-red-500 text-white"
                >
                  Remover
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-[#e84040]/80 rounded-xl p-6 text-center cursor-pointer bg-[#161927] transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-[#e84040]/10 flex items-center justify-center mx-auto mb-3 text-white/50 group-hover:text-[#e84040]">
                <Upload size={20} />
              </div>
              <p className="text-xs font-semibold text-white/80">
                {uploading ? "Enviando imagem..." : "Clique ou arraste a imagem aqui"}
              </p>
              <p className="text-[10px] text-white/40 mt-1">
                {compressEnabled ? "Modo Otimizado Ativo (WebP 92%)" : "Modo Qualidade Original Ativo (Sem compressão)"}
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          {/* Compression Badge Info */}
          {stats && compressEnabled && (
            <div className="mt-2 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
              <Sparkles size={12} className="shrink-0" />
              <span>
                Otimizado em Alta Definição! De <span className="line-through opacity-70">{stats.originalSize}</span> para{" "}
                <strong>{stats.compressedSize}</strong>.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
