import { NextResponse } from "next/server";
import { getAllProjects, createProject } from "@/services/projectsService";

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar projetos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.category) {
      return NextResponse.json({ error: "Título e categoria são obrigatórios" }, { status: 400 });
    }
    const newProject = await createProject(body);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar projeto" }, { status: 500 });
  }
}
