"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImageUploader } from "@/app/components/ImageUploader";
import { ArrowLeft, Save } from "lucide-react";

interface EditPostProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Desenvolvimento Web",
    subtitle: "",
    content: "",
    coverImg: "",
    author: "",
    publishedAt: "",
    readTime: "",
    featured: false,
    tagsStr: "",
  });

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (res.ok) {
          const post = await res.json();
          setFormData({
            title: post.title || "",
            slug: post.slug || "",
            category: post.category || "Desenvolvimento Web",
            subtitle: post.subtitle || "",
            content: post.content || "",
            coverImg: post.coverImg || "",
            author: post.author || "Eliabe dos Santos",
            publishedAt: post.publishedAt || "",
            readTime: post.readTime || "",
            featured: post.featured || false,
            tagsStr: (post.tags || []).join(", "),
          });
        } else {
          setError("Artigo não encontrado.");
        }
      } catch (err) {
        setError("Erro ao carregar artigo.");
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.content || !formData.coverImg) {
      setError("Preencha os campos obrigatórios (Título, Categoria, Imagem e Conteúdo).");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
        category: formData.category,
        subtitle: formData.subtitle,
        content: formData.content,
        coverImg: formData.coverImg,
        author: formData.author,
        publishedAt: formData.publishedAt,
        readTime: formData.readTime,
        featured: formData.featured,
        tags: formData.tagsStr.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin?tab=posts");
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao atualizar o artigo.");
      }
    } catch (err) {
      setError("Erro de rede ao atualizar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161927] text-[#ffffff] flex items-center justify-center text-xs">
        Carregando artigo...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161927] text-white flex flex-col font-sans" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Header */}
      <header className="px-8 py-5 border-b border-white/10 bg-[#1e2235] flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin?tab=posts" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-[#e84040]">
            <ArrowLeft size={16} /> Voltar ao Painel
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <h1 className="text-base font-bold uppercase tracking-wider text-white">Editar Artigo do Blog</h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full text-white transition-all shadow-lg hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#e84040" }}
        >
          <Save size={16} />
          {submitting ? "Salvando..." : "Salvar Alterações"}
        </button>
      </header>

      {/* Main Form */}
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        {error && (
          <div className="p-4 rounded-lg mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="p-6 rounded-xl bg-[#1e2235] border border-white/10 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#e84040] border-b border-white/10 pb-3">
              Informações do Artigo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  Título do Artigo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
                >
                  <option value="Desenvolvimento Web">Desenvolvimento Web</option>
                  <option value="Front-end">Front-end</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Carreira & Tech">Carreira & Tech</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  Autor
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  Data de Publicação
                </label>
                <input
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  Tempo de Leitura
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
                />
              </div>
            </div>

            <ImageUploader
              label="Imagem de Capa do Artigo"
              value={formData.coverImg}
              onChange={(url) => setFormData({ ...formData, coverImg: url })}
            />

            <div>
              <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                Subtítulo / Resumo Curto
              </label>
              <textarea
                rows={2}
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                Conteúdo do Artigo *
              </label>
              <textarea
                rows={10}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-[#e84040]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                Tags (Separadas por vírgula)
              </label>
              <input
                type="text"
                value={formData.tagsStr}
                onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 accent-[#e84040]"
              />
              <label htmlFor="featured" className="text-xs font-semibold text-white/80 cursor-pointer">
                Destacar este artigo no topo do Blog
              </label>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
