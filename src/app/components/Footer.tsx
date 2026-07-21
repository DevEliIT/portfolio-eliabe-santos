import { Mail, Linkedin, Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="contato"
      className="py-12 px-8 md:px-20 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5"
      style={{ backgroundColor: "#161927" }}
    >
      <div className="flex items-center gap-3">
        <Mail size={16} style={{ color: "#e84040" }} />
        <a
          href="mailto:eliabe.developer@gmail.com"
          className="text-xs text-white/70 hover:text-white transition-colors tracking-wide"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          eliabe.developer@gmail.com
        </a>
      </div>

      <div className="text-xs text-white/40 font-mono">
        © {new Date().getFullYear()} Eliabe Santos. Todos os direitos reservados.
      </div>

      <div className="flex items-center gap-5">
        {[
          { icon: <Linkedin size={18} />, label: "LinkedIn", href: "https://linkedin.com" },
          { icon: <Github size={18} />, label: "GitHub", href: "https://github.com" },
          { icon: <Twitter size={18} />, label: "Twitter", href: "https://twitter.com" },
          { icon: <Instagram size={18} />, label: "Instagram", href: "https://instagram.com" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-[#e84040] transition-colors p-1"
            title={s.label}
          >
            {s.icon}
          </a>
        ))}
      </div>
    </footer>
  );
}
