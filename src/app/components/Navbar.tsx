"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/5 backdrop-blur-md"
        style={{ backgroundColor: "rgba(30, 34, 53, 0.95)" }}
      >
        <Link href="/" className="flex items-center gap-1 group">
          <span
            className="text-xl font-bold px-2 py-0.5 rounded transition-transform group-hover:scale-105"
            style={{ color: "#e84040", fontFamily: "'Montserrat', sans-serif" }}
          >
            e
          </span>
          <span className="text-white text-sm font-semibold tracking-widest uppercase">
            eliabesantos
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link
              href="/"
              className="text-xs font-semibold tracking-widest uppercase text-white/75 hover:text-[#e84040] transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/#sobre"
              className="text-xs font-semibold tracking-widest uppercase text-white/75 hover:text-[#e84040] transition-colors"
            >
              Sobre
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="text-xs font-semibold tracking-widest uppercase text-white/75 hover:text-[#e84040] transition-colors"
            >
              Projetos
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="text-xs font-semibold tracking-widest uppercase text-white/75 hover:text-[#e84040] transition-colors"
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              href="/#contato"
              className="text-xs font-semibold tracking-widest uppercase text-white/75 hover:text-[#e84040] transition-colors"
            >
              Contato
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="text-xs font-bold tracking-widest uppercase px-4 py-2 rounded transition-all hover:bg-[#d03535]"
              style={{
                backgroundColor: "#e84040",
                color: "#ffffff",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Ver Trabalhos &rarr;
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div
          className="fixed top-[65px] left-0 right-0 z-40 flex flex-col items-center gap-5 py-6 border-b border-white/10"
          style={{ backgroundColor: "#1e2235" }}
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-xs font-semibold tracking-widest uppercase text-white/80 hover:text-[#e84040]"
          >
            Home
          </Link>
          <Link
            href="/#sobre"
            onClick={() => setMenuOpen(false)}
            className="text-xs font-semibold tracking-widest uppercase text-white/80 hover:text-[#e84040]"
          >
            Sobre
          </Link>
          <Link
            href="/projects"
            onClick={() => setMenuOpen(false)}
            className="text-xs font-semibold tracking-widest uppercase text-white/80 hover:text-[#e84040]"
          >
            Projetos
          </Link>
          <Link
            href="/blog"
            onClick={() => setMenuOpen(false)}
            className="text-xs font-semibold tracking-widest uppercase text-white/80 hover:text-[#e84040]"
          >
            Blog
          </Link>
          <Link
            href="/#contato"
            onClick={() => setMenuOpen(false)}
            className="text-xs font-semibold tracking-widest uppercase text-white/80 hover:text-[#e84040]"
          >
            Contato
          </Link>
          <Link
            href="/projects"
            onClick={() => setMenuOpen(false)}
            className="text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded mt-2"
            style={{ backgroundColor: "#e84040", color: "#ffffff" }}
          >
            Ver Trabalhos &rarr;
          </Link>
        </div>
      )}
    </>
  );
}
