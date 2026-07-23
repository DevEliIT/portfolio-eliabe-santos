import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ProjectGallery } from "@/app/components/ProjectGallery";
import { getAllProjects, getProjectBySlug, getAdjacentProjects } from "@/services/projectsService";
import { ArrowLeft, ExternalLink, Github, Calendar, User, Code2, CheckCircle2, ChevronRight, ChevronLeft, Building2 } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projeto Não Encontrado" };

  return {
    title: `${project.title} | Portfólio Eliabe dos Santos`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [project.coverImg],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { prev, next } = await getAdjacentProjects(slug);

  return (
    <div className="min-h-screen bg-[#1e2235] text-white flex flex-col font-sans" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        {/* HEADER & NAV BACK */}
        <div className="px-8 md:px-20 max-w-6xl mx-auto mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/60 hover:text-[#e84040] transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Voltar aos Projetos
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#e84040] block mb-2">
                {project.category}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white mb-4">
                {project.title}
              </h1>
              <p
                className="text-base md:text-lg text-white/70 font-light max-w-2xl"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                {project.subtitle}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3 shrink-0">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-full text-white transition-all shadow-lg hover:opacity-90"
                  style={{ backgroundColor: "#e84040" }}
                >
                  Ver Projeto Ao Vivo
                  <ExternalLink size={14} />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-5 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  GitHub
                  <Github size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* COVER IMAGE */}
        <section className="px-8 md:px-20 max-w-6xl mx-auto mb-16">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={project.coverImg}
              alt={project.title}
              fill
              priority
             // className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </section>

        {/* PROJECT SPECS BAR */}
        <section className="px-8 md:px-20 max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-6 rounded-xl bg-white/[0.03] border border-white/10">
            {project.company && (
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 flex items-center gap-1.5 mb-1">
                  <Building2 size={12} className="text-[#e84040]" /> Empresa
                </span>
                <p className="text-sm font-semibold text-white">{project.company}</p>
              </div>
            )}
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 flex items-center gap-1.5 mb-1">
                <User size={12} className="text-[#e84040]" /> Cliente
              </span>
              <p className="text-sm font-semibold text-white">{project.client}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 flex items-center gap-1.5 mb-1">
                <Calendar size={12} className="text-[#e84040]" /> Ano
              </span>
              <p className="text-sm font-semibold text-white">{project.year}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 flex items-center gap-1.5 mb-1">
                <Code2 size={12} className="text-[#e84040]" /> Função
              </span>
              <p className="text-sm font-semibold text-white">{project.role}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-1 block">
                Categoria
              </span>
              <p className="text-sm font-semibold text-[#e84040]">{project.category}</p>
            </div>
          </div>
        </section>

        {/* DETAILS CONTENT */}
        <section className="px-8 md:px-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Main Description & Challenges */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="w-8 h-1 mb-4" style={{ backgroundColor: "#e84040" }} />
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white mb-6">
                Visão Geral do Projeto
              </h2>
              <p
                className="text-sm md:text-base leading-relaxed text-white/80"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                {project.description}
              </p>
            </div>

            {/* Desafios e Solução */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div className="p-6 rounded-lg bg-white/[0.02] border border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#e84040] mb-3">
                  O Desafio
                </h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  {project.challenges}
                </p>
              </div>
              <div className="p-6 rounded-lg bg-white/[0.02] border border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3">
                  A Solução
                </h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Key Features */}
            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-4">
                  Principais Funcionalidades
                </h3>
                <ul className="space-y-3">
                  {project.keyFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-[#e84040] shrink-0 mt-0.5" />
                      <span className="text-xs md:text-sm text-white/80" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar / Tech Stack */}
          <div className="space-y-8">
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
              <h3 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
                Tecnologias Utilizadas
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/90"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Summary card */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#e84040]/10 to-transparent border border-[#e84040]/20">
              <h4 className="text-sm font-bold uppercase text-white mb-2">
                Gostou deste projeto?
              </h4>
              <p className="text-xs text-white/70 mb-4" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                Posso criar uma solução sob medida para sua empresa ou startup.
              </p>
              <a
                href="mailto:eliabe.developer@gmail.com"
                className="inline-block text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded bg-[#e84040] text-white hover:opacity-90 transition-opacity"
              >
                Falar Comigo &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* INTERACTIVE LIGHTBOX GALLERY */}
        <ProjectGallery gallery={project.gallery} title={project.title} />

        {/* NEXT / PREVIOUS NAVIGATION */}
        <section className="px-8 md:px-20 max-w-6xl mx-auto pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="flex items-center gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group w-full sm:w-auto"
              >
                <ChevronLeft size={20} className="text-[#e84040] transition-transform group-hover:-translate-x-1" />
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">
                    Projeto Anterior
                  </span>
                  <span className="text-sm font-bold text-white group-hover:text-[#e84040] transition-colors">
                    {prev.title}
                  </span>
                </div>
              </Link>
            ) : <div />}

            <Link
              href="/projects"
              className="text-xs font-bold tracking-widest uppercase text-white/60 hover:text-white transition-colors"
            >
              Ver Todos os Projetos
            </Link>

            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="flex items-center gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group w-full sm:w-auto text-right"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">
                    Próximo Projeto
                  </span>
                  <span className="text-sm font-bold text-white group-hover:text-[#e84040] transition-colors">
                    {next.title}
                  </span>
                </div>
                <ChevronRight size={20} className="text-[#e84040] transition-transform group-hover:translate-x-1" />
              </Link>
            ) : <div />}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
