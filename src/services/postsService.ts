import fs from "fs/promises";
import path from "path";
import { Post } from "@/types/post";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const postsFilePath = path.join(process.cwd(), "src", "data", "posts.json");

// Helper to read local JSON
async function readLocalPosts(): Promise<Post[]> {
  try {
    const data = await fs.readFile(postsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading local posts.json:", error);
    return [];
  }
}

// Helper to write local JSON
async function writeLocalPosts(posts: Post[]): Promise<void> {
  await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), "utf-8");
}

export async function getAllPosts(): Promise<Post[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      if (!error && data) return data as Post[];
    } catch (err) {
      console.error("Supabase fetch posts failed, falling back to local JSON", err);
    }
  }
  return readLocalPosts();
}

export async function getPostById(id: string): Promise<Post | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
      if (!error && data) return data as Post;
    } catch (err) {
      console.error("Supabase fetch post by ID failed", err);
    }
  }
  const posts = await readLocalPosts();
  return posts.find((p) => p.id === id) || null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).single();
      if (!error && data) return data as Post;
    } catch (err) {
      console.error("Supabase fetch post by slug failed", err);
    }
  }
  const posts = await readLocalPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export async function getAdjacentPosts(currentSlug: string): Promise<{ prev: Post | null; next: Post | null }> {
  const posts = await getAllPosts();
  const index = posts.findIndex((p) => p.slug === currentSlug);

  if (index === -1) return { prev: null, next: null };

  const prev = index > 0 ? posts[index - 1] : null;
  const next = index < posts.length - 1 ? posts[index + 1] : null;

  return { prev, next };
}

export async function savePost(post: Omit<Post, "id"> & { id?: string }): Promise<Post> {
  const newPost: Post = {
    ...post,
    id: post.id || Date.now().toString(),
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("posts").upsert(newPost).select().single();
      if (!error && data) return data as Post;
    } catch (err) {
      console.error("Supabase save post failed", err);
    }
  }

  // Local fallback
  const posts = await readLocalPosts();
  const existingIndex = posts.findIndex((p) => p.id === newPost.id);

  if (existingIndex >= 0) {
    posts[existingIndex] = newPost;
  } else {
    posts.unshift(newPost);
  }

  await writeLocalPosts(posts);
  return newPost;
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
  const existing = await getPostById(id);
  if (!existing) return null;
  const updatedData = { ...existing, ...data, id };
  return savePost(updatedData);
}

export async function deletePost(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.error("Supabase delete post failed", err);
    }
  }

  // Local fallback
  const posts = await readLocalPosts();
  const filtered = posts.filter((p) => p.id !== id);

  if (filtered.length === posts.length) {
    return false;
  }

  await writeLocalPosts(filtered);
  return true;
}
