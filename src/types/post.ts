export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  coverImg: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  featured: boolean;
  tags: string[];
}
