"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { Project } from "@/types/project";
import { Code2, ArrowUpRight, Filter, RefreshCw } from "lucide-react";

export default function ProjectsCatalogPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const categories = ["Todos", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = selectedCategory === "Todos"
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#1e2235] text-white flex flex-col font-sans" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-8 md:px-20 max-w-6xl mx-auto w-full">
        {/* HEADER SECTION */}
        <section className="mb-12 text-center md:text-left">
          <div className="w-8 h-1 mb-4 mx-auto md:mx-0" style={{ backgroundColor: "#e84040" }} />
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-white mb-4">
            Meus Projetos
          </h1>
          <p
            className="text-base md:text-lg text-white/70 max-w-2xl font-light"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Explore o portfólio completo de aplicações web, sistemas interativos e trabalhos de design de interfaces.
          </p>
        </section>

        {/* CATEGORY FILTER BUTTONS */}
        <section className="flex flex-wrap items-center gap-3 mb-12 border-b border-white/10 pb-6">
          <span className="text-xs text-white/40 uppercase font-bold tracking-widest flex items-center gap-1.5 mr-2">
            <Filter size={14} className="text-[#e84040]" /> Filtrar:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full transition-all border ${
                selectedCategory === cat
                  ? "bg-[#e84040] text-white border-[#e84040]"
                  : "bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* PROJECTS GRID */}
        {loading ? (
          <div className="py-20 text-center text-xs text-white/50 flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-[#e84040]" /> Carregando catálogo...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-xs text-white/50">
            Nenhum projeto encontrado nesta categoria.
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group relative flex flex-col bg-white/[0.02] rounded-xl overflow-hidden border border-white/10 hover:border-[#e84040]/50 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                {/* Image Banner */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.coverImg}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2235] via-transparent to-transparent opacity-80" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span
                      className="text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded text-white shadow"
                      style={{ backgroundColor: "#e84040" }}
                    >
                      {project.category}
                    </span>
                    <span className="text-[10px] font-mono text-white/80 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                      {project.year}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:text-white group-hover:bg-[#e84040] transition-colors">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white group-hover:text-[#e84040] transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p
                      className="text-xs md:text-sm text-white/70 leading-relaxed mb-6 line-clamp-2"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      {project.summary}
                    </p>
                  </div>

                  {/* Tech tags preview */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-medium px-2.5 py-1 rounded bg-white/5 text-white/60"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[10px] font-medium px-2 py-1 rounded bg-white/5 text-white/40">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
