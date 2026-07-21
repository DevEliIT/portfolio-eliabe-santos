import fs from "fs/promises";
import path from "path";
import { Project } from "@/types/project";
import { PROJECTS as DEFAULT_PROJECTS } from "@/data/projects";

const JSON_FILE_PATH = path.join(process.cwd(), "src", "data", "projects.json");

// Helper to ensure json file exists
async function ensureDataFileExists(): Promise<void> {
  try {
    await fs.access(JSON_FILE_PATH);
  } catch {
    const dir = path.dirname(JSON_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(JSON_FILE_PATH, JSON.stringify(DEFAULT_PROJECTS, null, 2), "utf-8");
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    await ensureDataFileExists();
    const data = await fs.readFile(JSON_FILE_PATH, "utf-8");
    return JSON.parse(data) as Project[];
  } catch (error) {
    console.error("Error reading projects JSON:", error);
    return DEFAULT_PROJECTS;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find((p) => p.id === id) || null;
}

export async function getAdjacentProjects(currentSlug: string) {
  const projects = await getAllProjects();
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return { prev: null, next: null };
  const prev = projects[(currentIndex - 1 + projects.length) % projects.length];
  const next = projects[(currentIndex + 1) % projects.length];
  return { prev, next };
}

export async function createProject(projectData: Omit<Project, "id">): Promise<Project> {
  const projects = await getAllProjects();
  
  // Generate slug if missing or format properly
  const slug = projectData.slug || projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  
  const newProject: Project = {
    ...projectData,
    id: Date.now().toString(),
    slug,
  };

  projects.unshift(newProject); // add to top
  await fs.writeFile(JSON_FILE_PATH, JSON.stringify(projects, null, 2), "utf-8");
  return newProject;
}

export async function updateProject(id: string, projectData: Partial<Project>): Promise<Project | null> {
  const projects = await getAllProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedProject: Project = {
    ...projects[index],
    ...projectData,
  };

  projects[index] = updatedProject;
  await fs.writeFile(JSON_FILE_PATH, JSON.stringify(projects, null, 2), "utf-8");
  return updatedProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getAllProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;

  await fs.writeFile(JSON_FILE_PATH, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}
