import fs from "fs/promises";
import path from "path";
import { Project } from "@/types/project";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const projectsFilePath = path.join(process.cwd(), "src", "data", "projects.json");

// Helper to read local JSON
async function readLocalProjects(): Promise<Project[]> {
  try {
    const data = await fs.readFile(projectsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading local projects.json:", error);
    return [];
  }
}

// Helper to write local JSON
async function writeLocalProjects(projects: Project[]): Promise<void> {
  await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), "utf-8");
}

export async function getAllProjects(): Promise<Project[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (!error && data) return data as Project[];
    } catch (err) {
      console.error("Supabase fetch failed, falling back to local JSON", err);
    }
  }
  return readLocalProjects();
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (!error && data) return data as Project;
    } catch (err) {
      console.error("Supabase fetch by ID failed", err);
    }
  }
  const projects = await readLocalProjects();
  return projects.find((p) => p.id === id) || null;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).single();
      if (!error && data) return data as Project;
    } catch (err) {
      console.error("Supabase fetch by slug failed", err);
    }
  }
  const projects = await readLocalProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function getAdjacentProjects(currentSlug: string): Promise<{ prev: Project | null; next: Project | null }> {
  const projects = await getAllProjects();
  const index = projects.findIndex((p) => p.slug === currentSlug);

  if (index === -1) return { prev: null, next: null };

  const prev = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;

  return { prev, next };
}

export async function saveProject(project: Omit<Project, "id"> & { id?: string }): Promise<Project> {
  const newProject: Project = {
    ...project,
    id: project.id || Date.now().toString(),
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("projects").upsert(newProject).select().single();
      if (!error && data) return data as Project;
    } catch (err) {
      console.error("Supabase save failed", err);
    }
  }

  // Local fallback
  const projects = await readLocalProjects();
  const existingIndex = projects.findIndex((p) => p.id === newProject.id);

  if (existingIndex >= 0) {
    projects[existingIndex] = newProject;
  } else {
    projects.unshift(newProject);
  }

  await writeLocalProjects(projects);
  return newProject;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
  const existing = await getProjectById(id);
  if (!existing) return null;
  const updatedData = { ...existing, ...data, id };
  return saveProject(updatedData);
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.error("Supabase delete failed", err);
    }
  }

  // Local fallback
  const projects = await readLocalProjects();
  const filtered = projects.filter((p) => p.id !== id);

  if (filtered.length === projects.length) {
    return false;
  }

  await writeLocalProjects(filtered);
  return true;
}
