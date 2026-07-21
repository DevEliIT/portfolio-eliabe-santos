"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, KeyRound, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Informe a senha de acesso.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Senha inválida.");
      }
    } catch (err) {
      setError("Erro de rede ao autenticar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161927] text-white flex flex-col justify-center items-center px-6 font-sans" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-[#e84040] transition-colors"
      >
        <ArrowLeft size={16} /> Voltar ao Portfólio
      </Link>

      <div className="w-full max-w-md bg-[#1e2235] border border-white/10 rounded-2xl p-8 shadow-2xl">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#e84040]/10 border border-[#e84040]/30 flex items-center justify-center mb-4">
            <Lock size={24} className="text-[#e84040]" />
          </div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
            Área Restrita
          </h1>
          <p className="text-xs text-white/50 mt-1" style={{ fontFamily: "'Open Sans', sans-serif" }}>
            Digite sua senha para acessar o painel admin.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-lg mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
              Senha de Acesso
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                required
                autoFocus
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161927] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e84040] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg text-xs font-bold uppercase tracking-widest text-white transition-all shadow-lg hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#e84040" }}
          >
            {loading ? "Autenticando..." : "Entrar no Painel"}
          </button>
        </form>
      </div>
    </div>
  );
}
