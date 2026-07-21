import { NextResponse } from "next/server";
import { getAllPosts, createPost } from "@/services/postsService";

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar artigos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.category || !body.content) {
      return NextResponse.json({ error: "Título, categoria e conteúdo são obrigatórios" }, { status: 400 });
    }
    const newPost = await createPost(body);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar artigo" }, { status: 500 });
  }
}
