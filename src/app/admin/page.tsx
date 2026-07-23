"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types/project";
import { Post } from "@/types/post";
import { ContactMessage } from "@/services/contactService";
import { Plus, Edit2, Trash2, ExternalLink, Search, LayoutDashboard, ArrowLeft, RefreshCw, Star, LogOut, BookOpen, FolderGit2, ChevronUp, ChevronDown, Building2, GripVertical, FileText, Inbox, Upload, Download, Mail, User, Clock, CheckCircle2 } from "lucide-react";

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "projects";

  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [resumeUrl, setResumeUrl] = useState("/uploads/curriculo.pdf");
  const [uploadingCv, setUploadingCv] = useState(false);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "projects") {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } else if (activeTab === "posts") {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } else if (activeTab === "messages") {
        const res = await fetch("/api/contact");
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      }

      // Always fetch current active CV URL
      const resResume = await fetch("/api/resume");
      if (resResume.ok) {
        const dataResume = await resResume.json();
        if (dataResume.resumeUrl) setResumeUrl(dataResume.resumeUrl);
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

  const handleReorder = async (newList: Project[]) => {
    setProjects(newList);
    try {
      const orderedIds = newList.map((p) => p.id);
      const res = await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      if (res.ok) {
        setMessage({ text: "Nova ordem dos projetos salva com sucesso!", type: "success" });
      } else {
        setMessage({ text: "Erro ao salvar a ordem no banco de dados.", type: "error" });
      }
    } catch (err) {
      console.error("Erro ao salvar ordem:", err);
      setMessage({ text: "Erro de conexão ao salvar a ordem.", type: "error" });
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...projects];
    const temp = newList[index - 1];
    newList[index - 1] = newList[index];
    newList[index] = temp;
    handleReorder(newList);
  };

  const handleMoveDown = (index: number) => {
    if (index === projects.length - 1) return;
    const newList = [...projects];
    const temp = newList[index + 1];
    newList[index + 1] = newList[index];
    newList[index] = temp;
    handleReorder(newList);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (search !== "") return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (search !== "" || draggedIndex === null) return;
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || search !== "") return;
    if (draggedIndex !== targetIndex) {
      const newList = [...projects];
      const [movedItem] = newList.splice(draggedIndex, 1);
      newList.splice(targetIndex, 0, movedItem);
      handleReorder(newList);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

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

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta mensagem?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setMessage({ text: "Mensagem excluída com sucesso!", type: "success" });
      } else {
        setMessage({ text: "Erro ao excluir a mensagem.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Erro de conexão ao excluir.", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setMessage({ text: "Por favor, selecione um arquivo válido em formato PDF.", type: "error" });
      return;
    }

    setUploadingCv(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setResumeUrl(data.resumeUrl);
        setMessage({ text: "Novo currículo enviado e ativado com sucesso!", type: "success" });
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Erro ao fazer upload do currículo.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Erro de conexão ao enviar o currículo.", type: "error" });
    } finally {
      setUploadingCv(false);
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

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
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
          {activeTab === "projects" && (
            <Link
              href="/admin/new"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full text-white transition-all shadow-lg hover:opacity-90"
              style={{ backgroundColor: "#e84040" }}
            >
              <Plus size={16} />
              Novo Projeto
            </Link>
          )}

          {activeTab === "posts" && (
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
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4 mb-8">
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

          <Link
            href="/admin?tab=messages"
            className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg border transition-all ${
              activeTab === "messages"
                ? "bg-[#e84040] text-white border-[#e84040]"
                : "bg-white/5 text-white/70 border-white/10 hover:text-white"
            }`}
          >
            <Inbox size={16} />
            Mensagens ({messages.length})
          </Link>

          <Link
            href="/admin?tab=resume"
            className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg border transition-all ${
              activeTab === "resume"
                ? "bg-[#e84040] text-white border-[#e84040]"
                : "bg-white/5 text-white/70 border-white/10 hover:text-white"
            }`}
          >
            <FileText size={16} />
            Meu Currículo (CV)
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
                      <th className="p-4 w-28 text-center">Ordem</th>
                      <th className="p-4">Projeto</th>
                      <th className="p-4">Empresa / Cliente</th>
                      <th className="p-4">Categoria</th>
                      <th className="p-4">Ano</th>
                      <th className="p-4">Destaque</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {filteredProjects.map((p, index) => (
                      <tr
                        key={p.id}
                        draggable={search === ""}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`transition-all ${
                          draggedIndex === index ? "opacity-30 bg-white/5" : ""
                        } ${
                          dragOverIndex === index && draggedIndex !== index
                            ? "border-t-2 border-t-[#e84040] bg-white/[0.05]"
                            : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span
                              className={`p-1 rounded cursor-grab active:cursor-grabbing text-white/30 hover:text-white/80 transition-colors ${
                                search !== "" ? "opacity-20 cursor-not-allowed" : ""
                              }`}
                              title={search === "" ? "Arraste para reordenar" : "Limpe a busca para arrastar"}
                            >
                              <GripVertical size={14} />
                            </span>
                            <span className="w-5 text-[11px] font-mono font-bold text-white/40">{index + 1}</span>
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={() => handleMoveUp(index)}
                                disabled={index === 0 || search !== ""}
                                className="p-1 rounded bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:hover:bg-white/5"
                                title="Mover para cima"
                              >
                                <ChevronUp size={12} />
                              </button>
                              <button
                                onClick={() => handleMoveDown(index)}
                                disabled={index === filteredProjects.length - 1 || search !== ""}
                                className="p-1 rounded bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:hover:bg-white/5"
                                title="Mover para baixo"
                              >
                                <ChevronDown size={12} />
                              </button>
                            </div>
                          </div>
                        </td>

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
                          {p.company ? (
                            <div className="flex items-center gap-1.5 text-white/90">
                              <Building2 size={13} className="text-[#e84040] shrink-0" />
                              <span className="font-medium text-xs">{p.company}</span>
                            </div>
                          ) : (
                            <span className="text-white/50 text-xs">{p.client || "-"}</span>
                          )}
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
                              className="p-2 rounded bg-[#1e2235] text-blue-400 hover:bg-blue-500/20 border border-white/10 transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={14} />
                            </Link>

                            <button
                              onClick={() => handleDeleteProject(p.id, p.title)}
                              disabled={deletingId === p.id}
                              className="p-2 rounded bg-[#1e2235] text-red-400 hover:bg-red-500/20 border border-white/10 transition-colors disabled:opacity-50"
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

        {/* TAB 3: CONTACT MESSAGES */}
        {activeTab === "messages" && (
          <div className="bg-[#1e2235] border border-white/10 rounded-xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-xs text-white/50">Carregando mensagens...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-12 text-center text-xs text-white/50">
                Nenhuma mensagem de contato recebida.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className="p-6 hover:bg-white/[0.02] transition-colors space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#e84040]/10 flex items-center justify-center text-[#e84040] font-bold text-xs shrink-0">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-white block">{msg.name}</span>
                          <a href={`mailto:${msg.email}`} className="text-xs text-white/60 hover:text-[#e84040]">
                            {msg.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-white/40">
                          {new Date(msg.createdAt).toLocaleString("pt-BR")}
                        </span>
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="p-1.5 rounded bg-white/5 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold px-3 inline-flex items-center gap-1"
                        >
                          <Mail size={12} /> Responder
                        </a>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          disabled={deletingId === msg.id}
                          className="p-1.5 rounded bg-white/5 text-red-400 hover:bg-red-500/20 text-xs font-semibold px-2.5 inline-flex items-center gap-1 disabled:opacity-50"
                        >
                          <Trash2 size={12} /> Excluir
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-[#e84040] uppercase tracking-wider block mb-1">
                        {msg.subject || "Sem Assunto"}
                      </span>
                      <p className="text-xs text-white/80 leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5 whitespace-pre-wrap font-sans">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MY RESUME (CV) */}
        {activeTab === "resume" && (
          <div className="p-8 rounded-xl bg-[#1e2235] border border-white/10 space-y-8 shadow-xl">
            <div>
              <div className="w-8 h-1 mb-3" style={{ backgroundColor: "#e84040" }} />
              <h2 className="text-lg font-bold uppercase tracking-wider text-white">
                Gerenciar Currículo (CV)
              </h2>
              <p className="text-xs text-white/60 font-light mt-1">
                Suba o seu currículo mais recente em formato PDF. Ele ficará disponível para download em todo o site.
              </p>
            </div>

            {/* Current Active CV Status */}
            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e84040]/10 flex items-center justify-center text-[#e84040]">
                  <FileText size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#e84040] block">
                    Currículo Ativo no Site
                  </span>
                  <span className="text-xs text-white/90 font-mono block mt-0.5 truncate max-w-md">
                    {resumeUrl}
                  </span>
                </div>
              </div>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all shrink-0"
              >
                <Download size={14} />
                Visualizar PDF
              </a>
            </div>

            {/* Upload Form Box */}
            <div className="p-8 rounded-xl bg-black/20 border-2 border-dashed border-white/15 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-white/60">
                <Upload size={20} />
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Subir Novo Arquivo PDF
                </h3>
                <p className="text-[11px] text-white/40 mt-1">
                  Selecione um arquivo .pdf do seu computador (Máx: 10MB)
                </p>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full text-white cursor-pointer transition-all hover:opacity-90 shadow-lg" style={{ backgroundColor: "#e84040" }}>
                  <Upload size={16} />
                  {uploadingCv ? "Enviando arquivo..." : "Selecionar Arquivo PDF"}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleCvUpload}
                    disabled={uploadingCv}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
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
