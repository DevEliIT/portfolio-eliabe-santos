"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle, Linkedin, Github, MapPin, Sparkles } from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: "error", text: "Por favor, preencha os campos obrigatórios (*)." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // 1. Save in system Admin Inbox
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // 2. Dispatch free email notification directly from browser context
      try {
        await fetch("https://formsubmit.co/ajax/eliabe.developer@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            _subject: `[Contato Portfolio] ${formData.subject || formData.name}`,
            message: formData.message,
            _template: "table",
          }),
        });
      } catch (clientEmailErr) {
        console.error("Erro ao enviar e-mail via cliente:", clientEmailErr);
      }

      if (res.ok) {
        setStatus({
          type: "success",
          text: "Mensagem enviada com sucesso! Entrarei em contato em breve.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        setStatus({
          type: "error",
          text: data.error || "Erro ao enviar mensagem. Tente novamente.",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        text: "Erro de conexão ao enviar mensagem. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const mailtoLink = `mailto:eliabe.developer@gmail.com?subject=${encodeURIComponent(
    formData.subject || "Contato pelo Portfólio"
  )}&body=${encodeURIComponent(
    `Nome: ${formData.name}\nEmail: ${formData.email}\n\nMensagem:\n${formData.message}`
  )}`;

  return (
    <section id="contato" className="py-24 px-8 md:px-20 bg-[#161927] border-t border-white/5 relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#e84040]/10 rounded-full blur-3xl -translate-y-1/2 -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center md:text-left"
        >
          <div className="w-8 h-1 mb-4 mx-auto md:mx-0" style={{ backgroundColor: "#e84040" }} />
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2 text-[#e84040]">
            Contato & Propostas
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
            Vamos Conversar
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-xl font-light" style={{ fontFamily: "'Open Sans', sans-serif" }}>
            Tem um projeto em mente, oportunidade de trabalho ou deseja discutir uma consultoria? Envie uma mensagem rápida abaixo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="p-8 rounded-2xl bg-[#1e2235] border border-white/10 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
                <Sparkles size={18} className="text-[#e84040]" /> Informações de Contato
              </h3>

              <div className="space-y-4 text-xs font-sans">
                <a
                  href="mailto:eliabe.developer@gmail.com"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-[#e84040]/50 hover:bg-white/10 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#e84040]/10 flex items-center justify-center text-[#e84040] group-hover:scale-110 transition-transform shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">E-mail Direto</span>
                    <span className="text-xs text-white/90 font-medium group-hover:text-white">eliabe.developer@gmail.com</span>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/eliabedossantos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-[#e84040]/50 hover:bg-white/10 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#e84040]/10 flex items-center justify-center text-[#e84040] group-hover:scale-110 transition-transform shrink-0">
                    <Linkedin size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">LinkedIn</span>
                    <span className="text-xs text-white/90 font-medium group-hover:text-white">in/eliabedossantos</span>
                  </div>
                </a>

                <a
                  href="https://github.com/eliabedossantos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-[#e84040]/50 hover:bg-white/10 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#e84040]/10 flex items-center justify-center text-[#e84040] group-hover:scale-110 transition-transform shrink-0">
                    <Github size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">GitHub</span>
                    <span className="text-xs text-white/90 font-medium group-hover:text-white">github.com/eliabedossantos</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-[#e84040]/10 flex items-center justify-center text-[#e84040] shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Localização</span>
                    <span className="text-xs text-white/90 font-medium">Brasil (Trabalho Remoto & Presencial)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-[#1e2235] border border-white/10 space-y-6 shadow-xl">
              {status && (
                <div
                  className={`p-4 rounded-xl flex items-start gap-3 text-xs font-semibold ${
                    status.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/10 border border-red-500/30 text-red-400"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span>{status.text}</span>
                    {status.type === "error" && (
                      <a
                        href={mailtoLink}
                        className="block mt-1 text-[11px] underline hover:text-white font-normal"
                      >
                        Clique aqui para enviar diretamente pelo seu programa de e-mail.
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#161927] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e84040] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                    Seu E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="exemplo@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#161927] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e84040] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  placeholder="Ex: Proposta de Projeto ou Vaga de Emprego"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e84040] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-white/70 mb-2">
                  Sua Mensagem *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escreva detalhes sobre o projeto ou sua mensagem..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#161927] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e84040] transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full text-white transition-all shadow-lg hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#e84040" }}
                >
                  <Send size={15} />
                  {loading ? "Enviando..." : "Enviar Mensagem"}
                </button>

                <a
                  href={mailtoLink}
                  className="text-[11px] text-white/50 hover:text-white transition-colors underline uppercase tracking-wider font-semibold"
                >
                  Ou abrir programa de e-mail
                </a>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
