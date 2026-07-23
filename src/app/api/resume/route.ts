import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getSettings, updateSettings } from "@/services/settingsService";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadsDirExists() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ resumeUrl: settings.resumeUrl });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao obter currículo" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo de currículo enviado" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `curriculo-${Date.now()}.pdf`;

    let publicUrl = `/uploads/${filename}`;

    // 1. Supabase Storage if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from("portfolio-images")
          .upload(filename, buffer, {
            contentType: file.type || "application/pdf",
            upsert: true,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from("portfolio-images")
            .getPublicUrl(filename);
          publicUrl = publicUrlData.publicUrl;
        }
      } catch (err) {
        console.error("Supabase Storage upload error for CV:", err);
      }
    }

    // 2. Save locally as fallback
    await ensureUploadsDirExists();
    const filePath = path.join(UPLOADS_DIR, filename);
    await fs.writeFile(filePath, buffer);

    // Save as standard active curriculo.pdf as well
    const fixedFilePath = path.join(UPLOADS_DIR, "curriculo.pdf");
    await fs.writeFile(fixedFilePath, buffer);

    // Update settings with active URL
    await updateSettings({ resumeUrl: publicUrl });

    return NextResponse.json({ success: true, resumeUrl: publicUrl });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return NextResponse.json({ error: "Erro ao salvar currículo" }, { status: 500 });
  }
}
