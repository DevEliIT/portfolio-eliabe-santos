"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImageUploader } from "@/app/components/ImageUploader";
import { MultiImageUploader } from "@/app/components/MultiImageUploader";
import { ArrowLeft, Save } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Front-end",
    subtitle: "",
    summary: "",
    description: "",
    client: "",
    year: new Date().getFullYear().toString(),
    role: "Front-end Developer & UI Designer",
    coverImg: "",
    featured: false,
    technologiesStr: "React, Next.js, TypeScript, Tailwind CSS",
    challenges: "",
    solution: "",
    keyFeaturesStr: "",
    gallery: [] as string[],
    liveUrl: "",
    githubUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.coverImg) {
      setError("Preencha os campos obrigatórios (Título, Categoria e Imagem de Capa).");
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
        summary: formData.summary,
        description: formData.description,
        client: formData.client || "Cliente Autônomo",
        year: formData.year,
        role: formData.role,
        coverImg: formData.coverImg,
        featured: formData.featured,
        technologies: formData.technologiesStr.split(",").map((t) => t.trim()).filter(Boolean),
        challenges: formData.challenges,
        solution: formData.solution,
        keyFeatures: formData.keyFeaturesStr.split("\n").map((f) => f.trim()).filter(Boolean),
        gallery: formData.gallery,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao salvar o projeto.");
      }
    } catch (err) {
      setError("Erro de rede ao salvar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161927] text-white flex flex-col font-sans" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Header */}
      <header className="px-8 py-5 border-b border-white/10 bg-[#1e2235] flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-[#e84040]">
            <ArrowLeft size={16} /> Voltar ao Painel
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <h1 className="text-base font-bold uppercase tracking-wider text-white">Novo Projeto</h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full text-white transition-all shadow-lg hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#e84040" }}
        >
          <Save size={16} />
          {submitting ? "Salvando..." : "Salvar Projeto"}
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
          {/* Informações Básicas */}
          <div className="p-6 rounded-xl bg-[#1e2235] border border-white/10 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#e84040] border-b border-white/10 pb-3">
              Informações Básicas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  Título do Projeto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: NeuroHealth"
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
                  <option value="Front-end">Front-end</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="UI Design">UI Design</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Full-stack">Full-stack</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  Cliente
                </label>
                <input
                  type="text"
                  placeholder="Ex: NeuroHealth Labs"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  Ano
                </label>
                <input
                  type="text"
                  placeholder="Ex: 2024"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  Sua Função / Papel
                </label>
                <input
                  type="text"
                  placeholder="Ex: Lead Designer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
                />
              </div>
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
                Destacar este projeto na Home Page
              </label>
            </div>
          </div>

          {/* Mídia e Links */}
          <div className="p-6 rounded-xl bg-[#1e2235] border border-white/10 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#e84040] border-b border-white/10 pb-3">
              Imagens & Links
            </h2>

            <ImageUploader
              label="Imagem de Capa do Projeto"
              value={formData.coverImg}
              onChange={(url) => setFormData({ ...formData, coverImg: url })}
            />

            <MultiImageUploader
              label="Galeria de Capturas de Tela"
              value={formData.gallery}
              onChange={(urls) => setFormData({ ...formData, gallery: urls })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  URL do Projeto Ao Vivo (opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://exemplo.com"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  URL do Repositório GitHub (opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
                />
              </div>
            </div>
          </div>

          {/* Descrições e Detalhes */}
          <div className="p-6 rounded-xl bg-[#1e2235] border border-white/10 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#e84040] border-b border-white/10 pb-3">
              Detalhamento Técnico
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                Subtítulo do Projeto
              </label>
              <input
                type="text"
                placeholder="Ex: Plataforma de Monitoramento de Saúde Neurológica"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                Resumo Curto
              </label>
              <textarea
                rows={2}
                placeholder="Breve resumo exibido nos cards da listagem..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                Descrição Completa
              </label>
              <textarea
                rows={4}
                placeholder="Descrição completa e detalhada do projeto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                Tecnologias Utilizadas (Separadas por vírgula)
              </label>
              <input
                type="text"
                placeholder="React, Next.js, TypeScript, Tailwind CSS, Figma"
                value={formData.technologiesStr}
                onChange={(e) => setFormData({ ...formData, technologiesStr: e.target.value })}
                className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  O Desafio
                </label>
                <textarea
                  rows={3}
                  placeholder="Qual foi o principal desafio enfrentado..."
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  A Solução
                </label>
                <textarea
                  rows={3}
                  placeholder="Como a solução foi desenvolvida..."
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                Funcionalidades Principais (Uma por linha)
              </label>
              <textarea
                rows={3}
                placeholder="Dashboard com gráficos interativos&#10;Alertas em tempo real"
                value={formData.keyFeaturesStr}
                onChange={(e) => setFormData({ ...formData, keyFeaturesStr: e.target.value })}
                className="w-full bg-[#161927] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e84040]"
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
