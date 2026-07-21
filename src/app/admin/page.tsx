"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types/project";
import { Post } from "@/types/post";
import { Plus, Edit2, Trash2, ExternalLink, Search, LayoutDashboard, ArrowLeft, RefreshCw, Star, LogOut, BookOpen, FolderGit2 } from "lucide-react";

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") === "posts" ? "posts" : "projects";

  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "projects") {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } else {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o projeto "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setMessage({ text: `Projeto "${title}" excluído com sucesso!`, type: "success" });
      } else {
        setMessage({ text: "Erro ao excluir o projeto.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Erro de conexão ao excluir.", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o artigo "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        setMessage({ text: `Artigo "${title}" excluído com sucesso!`, type: "success" });
      } else {
        setMessage({ text: "Erro ao excluir o artigo.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Erro de conexão ao excluir.", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#161927] text-white flex flex-col font-sans" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Header Admin */}
      <header className="px-8 py-5 border-b border-white/10 bg-[#1e2235] flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-[#e84040]">
            <ArrowLeft size={16} /> Ver Site
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <LayoutDashboard size={20} className="text-[#e84040]" />
            <h1 className="text-lg font-bold uppercase tracking-wider text-white">
              Painel Admin
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "projects" ? (
            <Link
              href="/admin/new"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full text-white transition-all shadow-lg hover:opacity-90"
              style={{ backgroundColor: "#e84040" }}
            >
              <Plus size={16} />
              Novo Projeto
            </Link>
          ) : (
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full text-white transition-all shadow-lg hover:opacity-90"
              style={{ backgroundColor: "#e84040" }}
            >
              <Plus size={16} />
              Novo Artigo
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
            title="Encerrar Sessão"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-8">
          <Link
            href="/admin"
            className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg border transition-all ${
              activeTab === "projects"
                ? "bg-[#e84040] text-white border-[#e84040]"
                : "bg-white/5 text-white/70 border-white/10 hover:text-white"
            }`}
          >
            <FolderGit2 size={16} />
            Projetos ({projects.length})
          </Link>

          <Link
            href="/admin?tab=posts"
            className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg border transition-all ${
              activeTab === "posts"
                ? "bg-[#e84040] text-white border-[#e84040]"
                : "bg-white/5 text-white/70 border-white/10 hover:text-white"
            }`}
          >
            <BookOpen size={16} />
            Artigos do Blog ({posts.length})
          </Link>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 flex items-center justify-between text-xs font-semibold ${
              message.type === "success" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-white/60 hover:text-white">✕</button>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder={activeTab === "projects" ? "Buscar projetos..." : "Buscar artigos..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1e2235] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#e84040]"
            />
          </div>

          <button
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white bg-[#1e2235] px-3 py-2 rounded-lg border border-white/10"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Atualizar
          </button>
        </div>

        {/* TAB 1: PROJECTS */}
        {activeTab === "projects" && (
          <div className="bg-[#1e2235] border border-white/10 rounded-xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-xs text-white/50">Carregando projetos...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-12 text-center text-xs text-white/50">
                Nenhum projeto encontrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 bg-black/20">
                      <th className="p-4">Projeto</th>
                      <th className="p-4">Categoria</th>
                      <th className="p-4">Ano</th>
                      <th className="p-4">Destaque</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {filteredProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded overflow-hidden bg-black/40 border border-white/10 shrink-0">
                              <Image src={p.coverImg} alt={p.title} fill className="object-cover" />
                            </div>
                            <div>
                              <span className="font-bold text-white block">{p.title}</span>
                              <span className="text-[10px] text-white/40 font-mono">/projects/{p.slug}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-white/5 text-white/80 border border-white/10">
                            {p.category}
                          </span>
                        </td>

                        <td className="p-4 font-mono text-white/70">{p.year}</td>

                        <td className="p-4">
                          {p.featured ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#e84040]">
                              <Star size={12} fill="#e84040" /> Sim
                            </span>
                          ) : (
                            <span className="text-[10px] text-white/30">Não</span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/projects/${p.slug}`}
                              target="_blank"
                              className="p-2 rounded bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                              title="Ver página"
                            >
                              <ExternalLink size={14} />
                            </Link>

                            <Link
                              href={`/admin/edit/${p.id}`}
                              className="p-2 rounded bg-white/5 text-blue-400 hover:bg-blue-500/20 transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={14} />
                            </Link>

                            <button
                              onClick={() => handleDeleteProject(p.id, p.title)}
                              disabled={deletingId === p.id}
                              className="p-2 rounded bg-white/5 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                              title="Excluir"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BLOG POSTS */}
        {activeTab === "posts" && (
          <div className="bg-[#1e2235] border border-white/10 rounded-xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-xs text-white/50">Carregando artigos...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-12 text-center text-xs text-white/50">
                Nenhum artigo encontrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 bg-black/20">
                      <th className="p-4">Artigo</th>
                      <th className="p-4">Categoria</th>
                      <th className="p-4">Data</th>
                      <th className="p-4">Leitura</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded overflow-hidden bg-black/40 border border-white/10 shrink-0">
                              <Image src={post.coverImg} alt={post.title} fill className="object-cover" />
                            </div>
                            <div>
                              <span className="font-bold text-white block">{post.title}</span>
                              <span className="text-[10px] text-white/40 font-mono">/blog/{post.slug}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-white/5 text-white/80 border border-white/10">
                            {post.category}
                          </span>
                        </td>

                        <td className="p-4 font-mono text-white/70">{post.publishedAt}</td>
                        <td className="p-4 text-white/70">{post.readTime}</td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-2 rounded bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                              title="Ver post"
                            >
                              <ExternalLink size={14} />
                            </Link>

                            <Link
                              href={`/admin/posts/edit/${post.id}`}
                              className="p-2 rounded bg-white/5 text-blue-400 hover:bg-blue-500/20 transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={14} />
                            </Link>

                            <button
                              onClick={() => handleDeletePost(post.id, post.title)}
                              disabled={deletingId === post.id}
                              className="p-2 rounded bg-white/5 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                              title="Excluir"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#161927] text-white flex items-center justify-center text-xs">Carregando painel admin...</div>}>
      <AdminContent />
    </Suspense>
  );
}
