"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none text-white/80 font-sans" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1
              className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white mt-10 mb-5 border-l-4 border-[#e84040] pl-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className="text-xl md:text-3xl font-extrabold uppercase tracking-tight text-white mt-10 mb-4 border-l-4 border-[#e84040] pl-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className="text-lg md:text-2xl font-bold uppercase tracking-tight text-white mt-8 mb-3 border-l-4 border-[#e84040]/70 pl-3"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4
              className="text-base md:text-xl font-bold uppercase tracking-wider text-white mt-6 mb-2"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-sm md:text-base leading-relaxed text-white/80 mb-5 font-normal">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#e84040] bg-[#e84040]/10 italic p-5 my-6 rounded-r-xl text-white/90 text-sm md:text-base leading-relaxed shadow">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-t border-white/10 my-8" />,
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-6 space-y-2 mb-6 text-sm md:text-base text-white/80">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 space-y-2 mb-6 text-sm md:text-base text-white/80">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed text-white/80 pl-1">{children}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e84040] font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {children}
            </a>
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline ? (
              <div className="relative my-6 rounded-xl overflow-hidden border border-white/10 bg-[#161927] shadow-xl">
                {match && (
                  <div className="bg-white/5 px-4 py-1.5 border-b border-white/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/50">
                    <span>{match[1]}</span>
                  </div>
                )}
                <pre className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-emerald-400 bg-transparent">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code
                className="bg-white/10 text-[#e84040] font-mono text-xs px-2 py-0.5 rounded border border-white/10"
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-8 rounded-xl border border-white/10 bg-[#161927]">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-white/5 font-bold uppercase text-xs text-[#e84040] border-b border-white/10">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="p-3.5 font-bold text-white border-b border-white/10">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-3.5 border-b border-white/5 text-white/80">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
