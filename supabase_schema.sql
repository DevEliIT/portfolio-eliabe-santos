-- Script SQL para criar as tabelas do Portfólio no Supabase
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Tabela de Projetos
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  subtitle TEXT,
  summary TEXT,
  description TEXT,
  client TEXT,
  year TEXT,
  role TEXT,
  "coverImg" TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  technologies TEXT[],
  challenges TEXT,
  solution TEXT,
  "keyFeatures" TEXT[],
  gallery TEXT[],
  company TEXT,
  "order" INTEGER DEFAULT 0,
  "liveUrl" TEXT,
  "githubUrl" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migrações (para tabelas existentes)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- 2. Tabela de Posts do Blog
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  "coverImg" TEXT NOT NULL,
  author TEXT DEFAULT 'Eliabe Santos',
  "publishedAt" TEXT NOT NULL,
  "readTime" TEXT DEFAULT '5 min de leitura',
  featured BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar a RLS (Row Level Security) e permitir acesso público para leitura/escrita
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir Leitura e Escrita Pública em Projetos"
  ON public.projects FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir Leitura e Escrita Pública em Posts"
  ON public.posts FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Criar o Bucket de Armazenamento de Imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Tabela de Configurações do Sistema
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabela de Mensagens de Contato
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir Leitura e Escrita em Settings"
  ON public.settings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir Leitura e Escrita em Contact Messages"
  ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

