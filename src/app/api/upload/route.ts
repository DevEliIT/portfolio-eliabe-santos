import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadsDirExists() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = path.extname(file.name) || ".webp";
    const filename = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // 1. SUPABASE STORAGE PERSISTENCE (If active on Vercel)
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from("portfolio-images")
          .upload(filename, buffer, {
            contentType: file.type || "image/webp",
            upsert: true,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from("portfolio-images")
            .getPublicUrl(filename);

          return NextResponse.json({ url: publicUrlData.publicUrl, size: buffer.length });
        } else {
          console.error("Supabase Storage upload error:", error);
        }
      } catch (supabaseErr) {
        console.error("Supabase Storage exception:", supabaseErr);
      }
    }

    // 2. LOCAL DISK STORAGE FALLBACK (For local dev)
    await ensureUploadsDirExists();
    const filePath = path.join(UPLOADS_DIR, filename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: publicUrl, size: buffer.length });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Erro ao salvar imagem no servidor" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json({ error: "URL da imagem não fornecida" }, { status: 400 });
    }

    // Extract filename from URL (e.g. img-1721588000-abcd.webp)
    const filename = imageUrl.split("/").pop();
    if (!filename) {
      return NextResponse.json({ error: "Nome de arquivo inválido" }, { status: 400 });
    }

    // 1. Delete from Supabase Storage if active
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.storage.from("portfolio-images").remove([filename]);
        if (error) {
          console.error("Supabase Storage delete error:", error);
        }
      } catch (supabaseErr) {
        console.error("Supabase Storage delete exception:", supabaseErr);
      }
    }

    // 2. Delete from local disk if exists
    try {
      const localFilePath = path.join(UPLOADS_DIR, filename);
      await fs.unlink(localFilePath);
    } catch {
      // Ignore if local file doesn't exist
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Erro ao excluir imagem" }, { status: 500 });
  }
}
