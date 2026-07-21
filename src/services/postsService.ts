import fs from "fs/promises";
import path from "path";
import { Post } from "@/types/post";

const JSON_FILE_PATH = path.join(process.cwd(), "src", "data", "posts.json");

async function ensureDataFileExists(): Promise<void> {
  try {
    await fs.access(JSON_FILE_PATH);
  } catch {
    const dir = path.dirname(JSON_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(JSON_FILE_PATH, "[]", "utf-8");
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    await ensureDataFileExists();
    const data = await fs.readFile(JSON_FILE_PATH, "utf-8");
    return JSON.parse(data) as Post[];
  } catch (error) {
    console.error("Error reading posts JSON:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export async function getPostById(id: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.id === id) || null;
}

export async function getAdjacentPosts(currentSlug: string) {
  const posts = await getAllPosts();
  const currentIndex = posts.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return { prev: null, next: null };
  const prev = posts[(currentIndex - 1 + posts.length) % posts.length];
  const next = posts[(currentIndex + 1) % posts.length];
  return { prev, next };
}

export async function createPost(postData: Omit<Post, "id">): Promise<Post> {
  const posts = await getAllPosts();
  
  const slug = postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  
  const newPost: Post = {
    ...postData,
    id: Date.now().toString(),
    slug,
    publishedAt: postData.publishedAt || new Date().toISOString().split("T")[0],
    author: postData.author || "Eliabe Santos",
  };

  posts.unshift(newPost); // add to top
  await fs.writeFile(JSON_FILE_PATH, JSON.stringify(posts, null, 2), "utf-8");
  return newPost;
}

export async function updatePost(id: string, postData: Partial<Post>): Promise<Post | null> {
  const posts = await getAllPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedPost: Post = {
    ...posts[index],
    ...postData,
  };

  posts[index] = updatedPost;
  await fs.writeFile(JSON_FILE_PATH, JSON.stringify(posts, null, 2), "utf-8");
  return updatedPost;
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await getAllPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;

  await fs.writeFile(JSON_FILE_PATH, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}
