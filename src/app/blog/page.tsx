"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { Post } from "@/types/post";
import { Search, Clock, Calendar, ArrowRight, RefreshCw } from "lucide-react";

export default function BlogCatalogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const categories = ["Todos", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const regularPosts = filteredProjectsWithoutFeatured(filteredPosts, featuredPost?.id);

  function filteredProjectsWithoutFeatured(list: Post[], featuredId?: string) {
    if (!featuredId || search || selectedCategory !== "Todos") return list;
    return list.filter((p) => p.id !== featuredId);
  }

  return (
    <div className="min-h-screen bg-[#1e2235] text-white flex flex-col font-sans" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-8 md:px-20 max-w-6xl mx-auto w-full">
        {/* HEADER SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:text-left"
        >
          <div className="w-8 h-1 mb-4 mx-auto md:mx-0" style={{ backgroundColor: "#e84040" }} />
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-white mb-4">
            Blog & Artigos
          </h1>
          <p
            className="text-base md:text-lg text-white/70 max-w-2xl font-light"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Pensamentos, tutoriais e reflexões sobre desenvolvimento front-end, arquitetura web, UI/UX e tecnologia.
          </p>
        </motion.section>

        {/* FEATURED POST BANNER */}
        {featuredPost && !search && selectedCategory === "Todos" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.01 }}
            className="mb-16"
          >
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white/[0.02] rounded-2xl overflow-hidden border border-white/10 hover:border-[#e84040]/50 transition-all p-6 md:p-8 shadow-2xl"
            >
              <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto rounded-xl overflow-hidden shrink-0">
                <Image
                  src={featuredPost.coverImg}
                  alt={featuredPost.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>

              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded bg-[#e84040] text-white"
                  >
                    Destaque
                  </span>
                  <span className="text-xs text-white/40 font-mono flex items-center gap-1">
                    <Clock size={12} /> {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-white group-hover:text-[#e84040] transition-colors leading-tight mb-4">
                  {featuredPost.title}
                </h2>

                <p
                  className="text-xs md:text-sm text-white/70 leading-relaxed mb-6 line-clamp-3"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {featuredPost.subtitle}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
                    <Calendar size={13} /> {featuredPost.publishedAt}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#e84040] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Ler artigo <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.section>
        )}

        {/* SEARCH & FILTERS */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-white/10 pb-6"
        >
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full transition-all border ${
                  selectedCategory === cat
                    ? "bg-[#e84040] text-white border-[#e84040]"
                    : "bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Buscar artigos ou tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#161927] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#e84040]"
            />
          </div>
        </motion.section>

        {/* POSTS GRID */}
        {loading ? (
          <div className="py-20 text-center text-xs text-white/50 flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-[#e84040]" /> Carregando artigos...
          </div>
        ) : regularPosts.length === 0 ? (
          <div className="py-20 text-center text-xs text-white/50">
            Nenhum artigo encontrado.
          </div>
        ) : (
          <motion.section layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {regularPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -6 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col bg-white/[0.02] rounded-xl overflow-hidden border border-white/10 hover:border-[#e84040]/50 transition-all duration-300 shadow-lg h-full"
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

                        <h3 className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-[#e84040] transition-colors mb-3 leading-snug">
                          {post.title}
                        </h3>

                        <p
                          className="text-xs text-white/70 leading-relaxed mb-6 line-clamp-3"
                          style={{ fontFamily: "'Open Sans', sans-serif" }}
                        >
                          {post.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                        <div className="flex flex-wrap gap-1">
                          {post.tags?.slice(0, 2).map((t) => (
                            <span key={t} className="text-[9px] text-white/50 bg-white/5 px-2 py-0.5 rounded">
                              #{t}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#e84040] group-hover:translate-x-1 transition-transform">
                          Ler &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.section>
        )}
      </main>

      <Footer />
    </div>
  );
}
