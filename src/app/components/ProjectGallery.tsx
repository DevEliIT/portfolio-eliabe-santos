"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectGalleryProps {
  gallery: string[];
  title: string;
}

export function ProjectGallery({ gallery, title }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? gallery.length - 1 : selectedIndex - 1);
  }, [selectedIndex, gallery.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === gallery.length - 1 ? 0 : selectedIndex + 1);
  }, [selectedIndex, gallery.length]);

  const handleClose = () => {
    setSelectedIndex(null);
  };

  // Keyboard navigation (ESC, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="px-8 md:px-20 max-w-6xl mx-auto mb-20">
      <div className="w-8 h-1 mb-4" style={{ backgroundColor: "#e84040" }} />
      <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white mb-8">
        Galeria do Projeto
      </h2>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gallery.map((imgUrl, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group cursor-pointer hover:border-[#e84040] shadow-xl bg-black/40"
          >
            <Image
              src={imgUrl}
              alt={`${title} captura ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Hover overlay with zoom icon */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
              <div className="w-10 h-10 rounded-full bg-[#e84040] flex items-center justify-center shadow-lg">
                <Maximize2 size={18} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Clique para ampliar</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10 select-none"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-[#e84040] text-white transition-colors shadow-lg"
              title="Fechar (ESC)"
            >
              <X size={24} />
            </button>

            {/* Counter Badge */}
            <div className="absolute top-6 left-6 text-xs font-mono font-semibold text-white/80 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full">
              Imagem {selectedIndex + 1} de {gallery.length}
            </div>

            {/* Previous Button */}
            {gallery.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[#e84040] text-white transition-colors shadow-lg z-50"
                title="Anterior (←)"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* Next Button */}
            {gallery.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[#e84040] text-white transition-colors shadow-lg z-50"
                title="Próxima (→)"
              >
                <ChevronRight size={28} />
              </button>
            )}

            {/* Large Image Container */}
            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            >
              <div className="relative w-full h-full aspect-video rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                <Image
                  src={gallery[selectedIndex]}
                  alt={`${title} detalhe ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
