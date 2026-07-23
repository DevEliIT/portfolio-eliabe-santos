import { NextResponse } from "next/server";
import { reorderProjects } from "@/services/projectsService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "orderedIds deve ser uma lista de IDs" }, { status: 400 });
    }

    const success = await reorderProjects(orderedIds);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Erro ao reordenar projetos" }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar requisição de reordenação" }, { status: 500 });
  }
}
