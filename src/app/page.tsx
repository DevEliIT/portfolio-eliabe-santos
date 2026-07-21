"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { Project } from "@/types/project";
import { Post } from "@/types/post";
import { Code2, LayoutGrid, ChevronDown, ArrowRight, Calendar, Clock } from "lucide-react";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [resProjects, resPosts] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/posts"),
        ]);
        if (resProjects.ok) {
          const dataProjects = await resProjects.json();
          setProjects(dataProjects);
        }
        if (resPosts.ok) {
          const dataPosts = await resPosts.json();
          setPosts(dataPosts);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#1e2235] text-white flex flex-col font-sans" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col justify-center px-8 md:px-20 pt-24 pb-16 overflow-hidden"
          style={{ backgroundColor: "#1e2235" }}
        >
          {/* Background texture overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative max-w-4xl"
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs font-semibold tracking-[0.3em] uppercase mb-6"
              style={{ color: "#e84040" }}
            >
              Olá, eu sou
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-none mb-6 uppercase tracking-tight"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Eliabe<br />Santos
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base md:text-lg font-light mb-10 max-w-md"
              style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Open Sans', sans-serif" }}
            >
              Desenvolvedor Front-end e Designer de Interfaces.
            </motion.p>

            <motion.a
              href="#sobre"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-7 py-3 rounded-full border transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.4)", color: "#ffffff" }}
            >
              Mais sobre mim
              <ChevronDown size={14} />
            </motion.a>
          </motion.div>

          {/* Scroll indicator with bounce animation */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <div
              className="w-px h-10"
              style={{ backgroundColor: "#e84040" }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#e84040" }}
            />
          </motion.div>
        </section>

        {/* SOBRE SECTION */}
        <section id="sobre" className="flex flex-col md:flex-row min-h-[60vh] overflow-hidden">
          {/* Left white */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 bg-white flex flex-col justify-center px-8 md:px-16 py-16"
          >
            <div
              className="w-8 h-1 mb-6"
              style={{ backgroundColor: "#e84040" }}
            />
            <h2
              className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-4"
              style={{ color: "#1e2235", fontFamily: "'Montserrat', sans-serif" }}
            >
              Sobre
            </h2>
            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: "#888", fontFamily: "'Open Sans', sans-serif" }}
            >
              Um pouco sobre minha trajetória e<br />carreira profissional.
            </p>
          </motion.div>

          {/* Right red */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col justify-center px-8 md:px-12 py-16"
            style={{ backgroundColor: "#e84040" }}
          >
            <p
              className="text-sm leading-loose text-white/90 mb-8 max-w-sm"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Sou desenvolvedor front-end e designer de interfaces com experiência em criar soluções digitais funcionais e visualmente atraentes. Apaixonado por tecnologia, UX e código limpo.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="self-start">
              <Link
                href="/projects"
                className="inline-block text-xs font-bold tracking-widest uppercase px-6 py-2.5 rounded-full border border-white text-white hover:bg-white hover:text-[#e84040] transition-all"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Ver Meus Projetos
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* SKILLS SECTION */}
        <section className="bg-white py-20 px-8 md:px-20 text-[#1e2235]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Front-end */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="flex flex-col items-start p-6 rounded-xl border border-transparent hover:border-gray-200 transition-all hover:shadow-lg"
            >
              <div
                className="w-14 h-14 flex items-center justify-center rounded border mb-6"
                style={{ borderColor: "#e0e0e0" }}
              >
                <Code2 size={24} style={{ color: "#e84040" }} />
              </div>
              <p
                className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1"
                style={{ color: "#e84040" }}
              >
                Desenvolvimento
              </p>
              <h3
                className="text-xl font-extrabold uppercase tracking-tight mb-4"
                style={{ color: "#1e2235", fontFamily: "'Montserrat', sans-serif" }}
              >
                Front-End
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#aaa", fontFamily: "'Open Sans', sans-serif" }}
              >
                Desenvolvimento de interfaces modernas e responsivas com Next.js, React, TypeScript e Tailwind CSS. Foco em performance e experiência do usuário.
              </p>
            </motion.div>

            {/* Interface Design */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -6 }}
              className="flex flex-col items-start p-6 rounded-xl border border-transparent hover:border-gray-200 transition-all hover:shadow-lg"
            >
              <div
                className="w-14 h-14 flex items-center justify-center rounded border mb-6"
                style={{ borderColor: "#e0e0e0" }}
              >
                <LayoutGrid size={24} style={{ color: "#e84040" }} />
              </div>
              <p
                className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1"
                style={{ color: "#e84040" }}
              >
                Design de
              </p>
              <h3
                className="text-xl font-extrabold uppercase tracking-tight mb-4"
                style={{ color: "#1e2235", fontFamily: "'Montserrat', sans-serif" }}
              >
                Interface
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#aaa", fontFamily: "'Open Sans', sans-serif" }}
              >
                Criação de interfaces intuitivas e visualmente impactantes com foco na experiência do usuário. Prototipação e design system no Figma com boas práticas de UX/UI.
              </p>
            </motion.div>
          </div>
        </section>

        {/* PORTFOLIO SECTION */}
        <section
          className="py-20 px-8 md:px-20"
          style={{ backgroundColor: "#1e2235" }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <div
                  className="w-8 h-1 mb-4"
                  style={{ backgroundColor: "#e84040" }}
                />
                <h2
                  className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-white"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Portfolio
                </h2>
              </div>
              <Link
                href="/projects"
                className="text-[10px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-full border transition-all hover:bg-white/10 flex items-center gap-1.5"
                style={{ borderColor: "rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.75)" }}
              >
                Ver todos
                <ArrowRight size={12} />
              </Link>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {projects.slice(0, 4).map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Link
                    href={`/projects/${item.slug}`}
                    className="relative overflow-hidden rounded-xl group cursor-pointer block shadow-xl"
                    style={{ aspectRatio: "1" }}
                  >
                    <Image
                      src={item.coverImg}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 flex flex-col items-start justify-end p-4 transition-all duration-300 ${
                        item.featured ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                      style={{
                        background: item.featured
                          ? "linear-gradient(to top, rgba(232,64,64,0.95) 0%, rgba(232,64,64,0.4) 60%, transparent 100%)"
                          : "linear-gradient(to top, rgba(30,34,53,0.95) 0%, transparent 60%)",
                      }}
                    >
                      <span className="text-[9px] font-bold tracking-widest uppercase mb-1 text-white/80">
                        {item.category}
                      </span>
                      <h4
                        className="text-sm font-bold uppercase text-white tracking-wide"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {item.title}
                      </h4>
                      <span className="mt-2 text-[9px] font-bold tracking-widest uppercase border border-white/80 text-white px-3 py-1 rounded-full hover:bg-white hover:text-[#e84040] transition-all">
                        Ver projeto &rarr;
                      </span>
                    </div>

                    {/* Tag icon */}
                    <div
                      className="absolute top-3 left-3 w-7 h-7 rounded flex items-center justify-center shadow"
                      style={{ backgroundColor: "#e84040" }}
                    >
                      <Code2 size={12} color="#fff" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BLOG SECTION ON HOME */}
        {posts.length > 0 && (
          <section className="py-20 px-8 md:px-20 bg-[#161927] border-t border-white/5">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between mb-10"
              >
                <div>
                  <div
                    className="w-8 h-1 mb-4"
                    style={{ backgroundColor: "#e84040" }}
                  />
                  <h2
                    className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-white"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Últimos Artigos
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-[10px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-full border transition-all hover:bg-white/10 flex items-center gap-1.5"
                  style={{ borderColor: "rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.75)" }}
                >
                  Ir para o Blog
                  <ArrowRight size={12} />
                </Link>
              </motion.div>

              {/* Blog Posts Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.slice(0, 3).map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -6 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col bg-[#1e2235] rounded-xl overflow-hidden border border-white/10 hover:border-[#e84040]/50 transition-all duration-300 shadow-lg h-full"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={post.coverImg}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute top-3 left-3 bg-[#e84040] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow">
                          {post.category}
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex items-center gap-3 text-[10px] text-white/40 font-mono mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} /> {post.publishedAt}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> {post.readTime}
                            </span>
                          </div>

                          <h3 className="text-base font-bold uppercase tracking-tight text-white group-hover:text-[#e84040] transition-colors mb-3 leading-snug">
                            {post.title}
                          </h3>

                          <p
                            className="text-xs text-white/70 leading-relaxed mb-6 line-clamp-2"
                            style={{ fontFamily: "'Open Sans', sans-serif" }}
                          >
                            {post.subtitle}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                          <span className="text-[10px] text-white/50">Por {post.author}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#e84040] group-hover:translate-x-1 transition-transform">
                            Ler mais &rarr;
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
