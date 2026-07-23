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
  company?: string;
  order?: number;
  liveUrl?: string;
  githubUrl?: string;
}
