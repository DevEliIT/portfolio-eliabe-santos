import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { MarkdownRenderer } from "@/app/components/MarkdownRenderer";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/services/postsService";
import { ArrowLeft, Calendar, Clock, User, Share2, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artigo Não Encontrado" };

  return {
    title: `${post.title} | Blog Eliabe dos Santos`,
    description: post.subtitle,
    openGraph: {
      title: post.title,
      description: post.subtitle,
      images: [post.coverImg],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = await getAdjacentPosts(slug);

  // Schema.org BlogPosting for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.subtitle,
    image: post.coverImg,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author || "Eliabe dos Santos",
    },
  };

  return (
    <div className="min-h-screen bg-[#1e2235] text-white flex flex-col font-sans" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        {/* HEADER & NAV BACK */}
        <section className="px-8 md:px-20 max-w-4xl mx-auto mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/60 hover:text-[#e84040] transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Voltar ao Blog
          </Link>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1 rounded bg-[#e84040]/10 border border-[#e84040]/30"
                style={{ color: "#e84040" }}
              >
                {post.category}
              </span>
              <span className="text-xs text-white/40 font-mono flex items-center gap-1">
                <Clock size={12} /> {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
              {post.title}
            </h1>

            <p
              className="text-base md:text-xl text-white/70 font-light leading-relaxed"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              {post.subtitle}
            </p>

            {/* Author Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e84040] flex items-center justify-center font-bold text-white text-sm shadow">
                  ES
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{post.author}</span>
                  <span className="text-[10px] text-white/40 font-mono flex items-center gap-1">
                    <Calendar size={11} /> {post.publishedAt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COVER IMAGE */}
        <section className="px-8 md:px-20 max-w-4xl mx-auto mb-12">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={post.coverImg}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </section>

        {/* ARTICLE BODY - FULL RICH MARKDOWN RENDERER */}
        <article className="px-8 md:px-20 max-w-4xl mx-auto mb-16">
          <MarkdownRenderer content={post.content} />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-8 mt-12 border-t border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40 mr-2">
                Tags:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* NEXT / PREVIOUS ARTICLE NAVIGATION */}
        <section className="px-8 md:px-20 max-w-4xl mx-auto pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group w-full sm:w-auto"
              >
                <ChevronLeft size={20} className="text-[#e84040] transition-transform group-hover:-translate-x-1" />
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">
                    Artigo Anterior
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-[#e84040] transition-colors line-clamp-1">
                    {prev.title}
                  </span>
                </div>
              </Link>
            ) : <div />}

            <Link
              href="/blog"
              className="text-xs font-bold tracking-widest uppercase text-white/60 hover:text-white transition-colors"
            >
              Ver Todos os Artigos
            </Link>

            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group w-full sm:w-auto text-right"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">
                    Próximo Artigo
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-[#e84040] transition-colors line-clamp-1">
                    {next.title}
                  </span>
                </div>
                <ChevronRight size={20} className="text-[#e84040] transition-transform group-hover:translate-x-1" />
              </Link>
            ) : <div />}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
