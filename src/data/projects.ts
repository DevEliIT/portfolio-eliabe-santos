export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  subtitle: string;
  summary: string;
  description: string;
  client: string;
  year: string;
  role: string;
  coverImg: string;
  featured: boolean;
  technologies: string[];
  challenges: string;
  solution: string;
  keyFeatures: string[];
  gallery: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "1",
    slug: "neurohealth",
    title: "NeuroHealth",
    category: "UI/UX Design",
    subtitle: "Plataforma de Monitoramento e Diagnóstico de Saúde Neurológica",
    summary: "Interface intuitiva desenvolvida para profissionais de saúde acompanharem métricas e exames neurológicos de pacientes em tempo real.",
    description: "O NeuroHealth é uma plataforma médica de alta precisão desenhada para simplificar a visualização de dados complexos de exames cerebrais e neurológicos. A solução conecta médicos especialistas a dados em tempo real através de dashboards inteligentes e alertas preditivos baseados em machine learning.",
    client: "NeuroHealth Labs",
    year: "2024",
    role: "UI/UX Designer & Lead Designer",
    coverImg: "https://images.unsplash.com/photo-1558655146-d09347e92766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBwb3J0Zm9saW8lMjB3b3JrfGVufDF8fHx8MTc4NDY1NjIwNnww&ixlib=rb-4.1.0&q=80&w=1200",
    featured: true,
    technologies: ["Figma", "UI/UX Design", "Design System", "Prototipagem", "User Research", "Tailwind CSS"],
    challenges: "Trabalhar com grande volume de dados médicos críticos exige altíssima clareza visual, prevenção de erros do usuário e uma arquitetura de informação focada em urgência médica.",
    solution: "Desenvolvemos um sistema de design escuro de alto contraste, com hierarquia tipográfica rigorosa, cards de sinalização por cores normalizados e acesso a históricos em apenas 2 cliques.",
    keyFeatures: [
      "Dashboard analítico com relatórios gráficos interativos de eletroencefalograma.",
      "Sistema de alertas em tempo real para variações de ondas cerebrais.",
      "Prontuário digital integrado com controle de acesso por níveis de especialidade médica.",
      "Design System completo exportado no Figma e documentado com tokens de estilo."
    ],
    gallery: [
      "https://images.unsplash.com/photo-1558655146-d09347e92766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000"
    ],
    liveUrl: "https://example.com/neurohealth",
    githubUrl: "https://github.com/example/neurohealth"
  },
  {
    id: "2",
    slug: "app-mobile",
    title: "App Mobile Financial",
    category: "Front-end",
    subtitle: "Aplicativo Mobile de Gestão Financeira Pessoal e Investimentos",
    summary: "Experiência mobile fluida desenvolvida com React Native e Tailwind para controle de gastos e projeções financeiras.",
    description: "Aplicativo mobile moderno criado para revolucionar a forma como jovens adultos organizam suas finanças diárias e investimentos. O app oferece integração bancária via Open Finance, metas financeiras gamificadas e gráficos de evolução de patrimônio.",
    client: "Fintech Growth",
    year: "2024",
    role: "Front-end Mobile Developer",
    coverImg: "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx3ZWIlMjBkZXNpZ24lMjBwb3J0Zm9saW8lMjB3b3JrfGVufDF8fHx8MTc4NDY1NjIwNnww&ixlib=rb-4.1.0&q=80&w=1200",
    featured: false,
    technologies: ["React Native", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Recharts", "Figma"],
    challenges: "Garantir performance de 60fps em animações de transição de saldo e gráficos complexos em dispositivos de entrada e intermediários.",
    solution: "Utilização de Reanimated 3 com componentes nativos otimizados, lazy loading de listas infinitas de extrato e gerenciamento de estado local eficiente.",
    keyFeatures: [
      "Sincronização bancária automática e categorização inteligente de despesas.",
      "Simulador interativo de rendimento de investimentos a curto e longo prazo.",
      "Modo escuro e claro com personalização dinâmica de temas visuais.",
      "Notificações push personalizadas com alertas de orçamento excedido."
    ],
    gallery: [
      "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000",
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000"
    ],
    liveUrl: "https://example.com/app-mobile",
    githubUrl: "https://github.com/example/app-mobile"
  },
  {
    id: "3",
    slug: "dashboard",
    title: "Analytics Dashboard",
    category: "UI Design",
    subtitle: "Painel Administrativo para Análise de Métricas de Vendas e BI",
    summary: "Painel responsivo focado em métricas estratégicas, conversão de usuários e performance de campanhas de marketing digital.",
    description: "Um dashboard corporativo construído para equipes de vendas e diretores de marketing acompanharem o desempenho da operação comercial em um único lugar. O painel inclui filtros em tempo real, exportação automatizada de relatórios em PDF/CSV e widgets customizáveis.",
    client: "Metrics Corp",
    year: "2023",
    role: "Front-end Developer & UI Designer",
    coverImg: "https://images.unsplash.com/photo-1516131206008-dd041a9764fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx3ZWIlMjBkZXNpZ24lMjBwb3J0Zm9saW8lMjB3b3JrfGVufDF8fHx8MTc4NDY1NjIwNnww&ixlib=rb-4.1.0&q=80&w=1200",
    featured: false,
    technologies: ["Next.js", "React", "Tailwind CSS", "Recharts", "Lucide Icons", "TypeScript"],
    challenges: "Apresentar dezenas de tabelas e gráficos em telas menores mantendo a leitura fluida e acessibilidade dos controles.",
    solution: "Criação de um sistema de grid responsivo com cards expansíveis e controles de visibilidade de colunas ativados pelo usuário.",
    keyFeatures: [
      "Visualização dinâmica de funil de vendas e LTV (Lifetime Value).",
      "Filtro temporal avançado (diário, semanal, mensal e customizado).",
      "Exportação instantânea de relatórios executivos em formato PDF e Excel.",
      "Layout totalmente responsivo adaptado para desktop, tablet e telas ultra-wide."
    ],
    gallery: [
      "https://images.unsplash.com/photo-1516131206008-dd041a9764fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000"
    ],
    liveUrl: "https://example.com/dashboard",
    githubUrl: "https://github.com/example/dashboard"
  },
  {
    id: "4",
    slug: "e-commerce",
    title: "Minimal E-commerce",
    category: "Front-end",
    subtitle: "Plataforma E-commerce para Marcas de Moda e Produtos Premium",
    summary: "Experiência de compra moderna com checkout ultra rápido, visual minimalista e animações de produto refinadas.",
    description: "Projeto de e-commerce completo projetado para marcas que prezam por elegância e experiência de marca. A plataforma integra catálogo dinâmico de produtos, filtro por atributos em tempo real, carrinho lateral rápido e checkout integrado com Stripe.",
    client: "Aura Apparel",
    year: "2023",
    role: "Lead Front-end Developer",
    coverImg: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx3ZWIlMjBkZXNpZ24lMjBwb3J0Zm9saW8lMjB3b3JrfGVufDF8fHx8MTc4NDY1NjIwNnww&ixlib=rb-4.1.0&q=80&w=1200",
    featured: false,
    technologies: ["Next.js", "React", "Tailwind CSS", "Stripe API", "Framer Motion", "TypeScript"],
    challenges: "Reduzir o tempo de carregamento de páginas de produtos com imagens de altíssima resolução e manter animações contínuas durante a troca de variantes de cor e tamanho.",
    solution: "Implementação do Next.js Image Optimization, pré-carregamento estatístico de imagens de produtos e animações leves acionadas por GPU.",
    keyFeatures: [
      "Galeria interativa de fotos de produtos com zoom de alta qualidade.",
      "Carrinho de compras tipo drawer lateral com atualização em tempo real.",
      "Checkout integrado com suporte a PIX, cartão de crédito e carteiras digitais.",
      "Search instantâneo com autocomplete e sugestão de produtos relacionados."
    ],
    gallery: [
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000"
    ],
    liveUrl: "https://example.com/e-commerce",
    githubUrl: "https://github.com/example/e-commerce"
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getAdjacentProjects(currentSlug: string) {
  const currentIndex = PROJECTS.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return { prev: null, next: null };
  const prev = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(currentIndex + 1) % PROJECTS.length];
  return { prev, next };
}
